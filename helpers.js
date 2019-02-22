module.exports.gotoThanksIfSigned = function gotoThanksIfSigned(
    req,
    res,
    next,
) {
    if (req.session.signed === true) {
        res.redirect('/thanks');
    } else
        next();
};
