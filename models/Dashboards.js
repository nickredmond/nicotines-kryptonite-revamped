var mongoose = require('mongoose');

var dashboardSchema = new mongoose.Schema({
	milestones: [{type: mongoose.Schema.Types.ObjectId, ref: 'Milestone'}],
	financialGoal: {type: String, null: true},
	financialGoalCost: {type: Number, default: 0},
	dateQuit: Date
});

mongoose.model('Dashboard', dashboardSchema);