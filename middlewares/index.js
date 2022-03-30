const { postSchema, profileSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Post = require('../models/posts');
const Class = require('../models/class');

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/post/${id}`);
    }
    next();
}

module.exports.validateProfile = (req, res, next) => {
    const { error } = profileSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentClass = await Class.findById(id);
        if (!currentClass.students.includes(req.user._id)) {
            req.flash('error', 'Your not a member');
            return res.redirect('/class');
        }
        next();
    } catch (e) {
        req.flash('error', 'Cannot find that class')
        res.redirect('/class')
    }
}

module.exports.isTeacher = async (req, res, next) => {
    if (req.user.type !== 'Teacher') {
        req.flash('error', 'Only Teacher can do that');
        res.redirect('/class');
    }
    next();
}
