const mongoose = require("mongoose")

/**
 * Flow model for MongoDB
 */
const flowSchema = new mongoose.Schema({
  nodes: Array,
  edges: Array,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Flow", flowSchema)
