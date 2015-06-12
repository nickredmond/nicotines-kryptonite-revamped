var mongoose = require('mongoose');

var tobaccoPricingSchema = new mongoose.Schema({
	tobaccoType: {type: String, enum: ["cigarette", "smokeless", "cigar", "patch", "lozenge", "gum", "ecig"]},
	brandName: String,
	state: String,
	averagePrice: Number,
	amountPerUnit: {type: Number, default: 1}
});

mongoose.model('TobaccoPricing', tobaccoPricingSchema);