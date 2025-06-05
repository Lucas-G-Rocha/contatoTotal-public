const express = require('express');
const { validationResult } = require('express-validator');

module.exports.validarCampos = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(err => err.msg);
      return res.status(400).json({ validationErrors: messages });
    }

    next();
  } catch (error) {

    res.status(500).json({ catchError: error.message });
  }
};



