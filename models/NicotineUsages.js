var mongoose = require('mongoose');

var nicotineUsageSchema = new mongoose.Schema({
	dateUsed: Date,
	nicotineType: {type: String, enum: ["cigarette", "smokeless", "cigar", "patch", "lozenge", "gum", "ecig"]},
	quantityUsed: {type: Number, default: 0}
});

mongoose.model('NicotineUsage', nicotineUsageSchema);