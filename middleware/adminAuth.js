const isLogin = async(req, res, next) => {
    try {
        
        if(!req.session.user_id){
            res.redirect("/admin");
        } else {
            next();
        }
        

    } catch (error) {
        console.log("errore from admin isLogin" + error.message);
    }
}

const isLogout = async(req, res, next) => {
    try {
        
        if(req.session.user_id){
            res.redirect("/admin/home")
        }
        next();

    } catch (error) {
        console.log("error from admin isLogout" + error);

    }
}

module.exports = {
    isLogin,
    isLogout
}