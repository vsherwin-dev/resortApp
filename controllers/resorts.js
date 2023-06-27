const Resort = require('../models/resort');

module.exports.index = async (req, res) => {
    const resorts = await Resort.find({});
    res.render('resorts/index', { resorts })
}

module.exports.renderNewForm = (req, res) => {
    res.render('resorts/new');
}

module.exports.createResort = async (req, res, next) => {
    const resort = new Resort(req.body.resort);
    resort.author = req.user._id;
    await resort.save();
    req.flash('success', 'Successfully made a new resort!');
    res.redirect(`/resorts/${resort._id}`)
}

module.exports.showResort = async (req, res,) => {
    const resort = await Resort.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!resort) {
        req.flash('error', 'Cannot find that resort!');
        return res.redirect('/resorts');
    }
    res.render('resorts/show', { resort });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const resort = await Resort.findById(id)
    if (!resort) {
        req.flash('error', 'Cannot find that resort!');
        return res.redirect('/resorts');
    }
    res.render('resorts/edit', { resort });
}

module.exports.updateResort = async (req, res) => {
    const { id } = req.params;
    const resort = await Resort.findByIdAndUpdate(id, { ...req.body.resort });
    req.flash('success', 'Successfully updated resort!');
    res.redirect(`/resorts/${resort._id}`)
}

module.exports.deleteResort = async (req, res) => {
    const { id } = req.params;
    await Resort.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted resort')
    res.redirect('/resorts');
}