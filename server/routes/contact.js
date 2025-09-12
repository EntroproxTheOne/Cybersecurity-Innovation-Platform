const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// @route   POST /api/contact
// @desc    Send contact form message
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('company').optional().trim().isLength({ min: 2 }).withMessage('Company name must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message, company, phone } = req.body;

    // Save contact form to database
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      company: company || '',
      phone: phone || '',
      status: 'new',
      submittedAt: new Date()
    });

    await contact.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'admin@thinkai3.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `
    };

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Thank you for contacting THINK AI 3.0',
      html: `
        <h2>Thank you for your message!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>THINK AI 3.0 Team</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(confirmationMailOptions);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Message sent successfully! We will get back to you soon.',
      contactId: contact._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error while processing your message' });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(filter)
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error while fetching contacts' });
  }
});

// @route   PUT /api/contact/:id
// @desc    Update contact message status
// @access  Private
router.put('/:id', [
  body('status').isIn(['new', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        notes: notes || '',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Server error while updating contact' });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error while deleting contact' });
  }
});

// @route   GET /api/contact/stats
// @desc    Get contact form statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.submittedAt = {};
      if (startDate) dateFilter.submittedAt.$gte = new Date(startDate);
      if (endDate) dateFilter.submittedAt.$lte = new Date(endDate);
    }

    const [
      totalContacts,
      newContacts,
      inProgressContacts,
      resolvedContacts,
      statusDistribution
    ] = await Promise.all([
      Contact.countDocuments(dateFilter),
      Contact.countDocuments({ ...dateFilter, status: 'new' }),
      Contact.countDocuments({ ...dateFilter, status: 'in_progress' }),
      Contact.countDocuments({ ...dateFilter, status: 'resolved' }),
      Contact.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      totalContacts,
      newContacts,
      inProgressContacts,
      resolvedContacts,
      statusDistribution
    });
  } catch (error) {
    console.error('Contact stats error:', error);
    res.status(500).json({ message: 'Server error while fetching contact statistics' });
  }
});

module.exports = router;
