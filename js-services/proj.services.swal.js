proj.services.swal = proj.services.swal || {};

//===** Brian loves you, so he made this for you <3 **===
//====**ADD MORE GENERIC ALERTS TO THIS SERVICE**====

/* Added for the Address page. - Ronald */

proj.services.swal.addressDelete = function () {
    var deleteConfirm = swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes, delete it!',
        buttonsStyling: false
    })
    return deleteConfirm;
}

proj.services.swal.addressUpdate = function() {
    swal({
        title: "The address has been updated.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-success"
    });
}


proj.services.swal.invalidAddress = function() {
    swal({
        title: "Invalid Address!",
        text: "We were unable to locate the address inputted.",
        buttonsStyling: false,
        type: "error",
        confirmButtonClass: "btn btn-danger"
    });
}
/**** End of Ronald's swal functions ****/

proj.services.swal.promptDelete = function (type, fx)
{
    fx = fx || 0;
    var sw = {};

    if (type == "default")
    {
        sw.title = "Are you sure?";
        sw.text = "It will be gone forever!";
        sw.type = "warning";
        sw.showCloseButton = true;
        sw.showCancelButton = true;
        sw.confirmButtonClass = 'btn btn-success';
        sw.confirmButtonText = "Delete it!";
        sw.cancelButtonClass = 'btn btn-danger';
        sw.cancelButtonText = "Cancel!";
    }
    else if (type == "success")
    {
        sw.title = "Deleted";
        sw.text = "Hope you weren't needing that!";
        sw.type = "success";
        sw.confirmButtonClass = 'btn btn-success';
        sw.confirmButtonText = "Sure don't!";
        sw.showCancelButton = false;
    }

    if (type == "default")
    {
        swal(sw).then(function ()
        {
            fx();
        }
        , function (dismiss)
        {
            if (dismiss === "cancel")
            {
                swal(
                {
                    title: "Cancelled"
                    , text: "Had a change of heart?"
                    , type: "error"
                    , confirmButtonText: "Sure did!"
                    , showCancelButton: false
                })
            }
        });
    }
    else
    {
        swal(sw);
    }
}

proj.services.swal.submitRedirect = function (url)
{
    var sw =
    {
        title: "Submitted!"
        , text: "Stand by for redirect..."
        , type: "success"
        , timer: 2000
        , showConfirmButton: false
        , showCancelButton: false
    };
    swal(sw).then(
        // empty f(x) for handling the promise rejection
        //==> **DO NOT REMOVE** <==
        function ()
        {
        }
        , function (dismiss)
        {
            if (dismiss === 'timer')
            {
                window.location.href = url;
            }
        }
    );
}

proj.services.swal.submitSuccess = function () {
    var sw =
    {
        title: "Submitted!"
        , text: ""
        , type: "success"
        , timer: 2000
        , showConfirmButton: false
        , showCancelButton: false
    };
    swal(sw)
}

proj.services.swal.pwStrengthError = function ()
{
    swal({
        title: "Invalid Password Strength!"
        , text: "Your password was too weak. Your password must be between 8 and 16 characters and include at least 1 lowercase, 1 uppercase, 1 symbol, and 1 number."
        , type: "error"
        , confirmButtonClass: 'btn btn-danger'
        , confirmButtonText: "Okay"
        , showCancelButton: false
    })
}

proj.services.swal.confirmEmail = function (type, url)
{
    type = type || "";
    var sw =
    {
        title: "Email Sent!"
        , text: "A confirmation link was sent to the provided email address."
        , buttonsStyling: false
        , confirmButtonClass: "btn btn-success"
        , type: "success"
        , onClose: function ()
        {
            if (url)
            {
                window.location.href = url;
            }
        }
    };

    if (type == 'update-success')
    {
        sw.title = "Password Update Successful!";
        sw.text = "You can now log in.";
        sw.showCancelButton = false;
        sw.confirmButtonText = "Let's go!"
        sw.confirmButtonClass = "btn btn-primary";
        sw.onClose = function ()
        {
            window.location.href = url;
        };
        sw.timer = 7000;
    }
    else if (type == 'failed')
    {
        sw.title = "Confirmation Failed!";
        sw.text = "The email or password provided was invalid.";
        sw.type = "warning";
        sw.confirmButtonClass = "btn btn-danger";
    }
    else if (type == 'token-check-fail')
    {
        sw.title = "Your Token Is No Longer Valid!";
        sw.text = "Please request a new password recovery email to alter your password again.";
        sw.type = "error";
        sw.confirmButtonClass = "btn btn-danger";
        sw.onClose = function ()
        {
            window.location.href = url;
        };
        sw.timer = 7000;
    };
    swal(sw);
}

proj.services.swal.login = function (type, url)
{
    url = url || "/"
    var sw = {
        title: "You're Logged In!",
        text: "Go forth and kick some Lash.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-success",
        type: "success",
    };

    if (type == "success")
    {
        sw.onClose = function ()
        {
            console.log(url);
            
            //redirect to targetUrl after successful login
            window.location.href = url;
        }
    }
    else if (type == 'failed')
    {
        sw.title = "Login Failed!"
        sw.text = "The email or password provided was invalid."
        sw.type = "error"
        sw.confirmButtonClass = "btn btn-danger"
    }
    else if (type == "confirm")
    {
        sw.title = "Login Failed!"
        sw.text = "Your email is still unconfirmed. Please click the confirmation link provided in the email to continue."
        sw.type = "warning"
        sw.confirmButtonClass = "btn btn-warning"
    }
    else if (type == "blocked") {
        sw.title = "User Blocked!"
        sw.text = "This user has been blocked."
        sw.type = "warning"
        sw.confirmButtonClass = "btn btn-warning"
    }

    swal(sw);

}

proj.services.swal.reloadDelete = function (type, fx)
{
    fx = fx || 0;
    var sw = {};
    
    if (type == "default")
    {
        sw.title = "Are you sure?";
        sw.text = "It will be gone forever!";
        sw.type = "warning";
        sw.showCloseButton = true;
        sw.showCancelButton = true;
        sw.confirmButtonClass = 'btn btn-success';
        sw.confirmButtonText = "Delete it!";
        sw.cancelButtonClass = 'btn btn-danger';
        sw.cancelButtonText = "Cancel!";
    }

    if (type == "default")
    {
        swal(sw).then(function ()
        {
            fx(location.reload());
        }
        , function (dismiss)
        {
            if (dismiss === "cancel")
            {
                swal(
                {
                    title: "Cancelled"
                    , text: "Had a change of heart?"
                    , type: "error"
                    , confirmButtonText: "Sure did!"
                    , showCancelButton: false
                })
            }
        });
    }
    else
    {
        swal(sw);
    }
}

proj.services.swal.deleteItem = function (callBack) {
    swal({
        title: 'Remove Item?',
        text: "",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function () {
        
        callBack();
        swal(
          'Item Removed',
          '',
          'success'
        )
    })
};

proj.services.swal.continueShopping = function (callBack) {
    swal({
        title: 'No Lash Girl Product In Cart',
        text: "Continue Shopping",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continue'
    }).then(function () {
        callBack();        
    })

};

proj.services.swal.subscribeNewsletter = function (firstName, yesCallBack, noCallBack) {
    swal({
        type: "question",
        html: "Sign Up To " + firstName + " Newsletter Too?",
        showCancelButton: true,
        buttonsStyling: false,
        showLoaderOnConfirm: true,
        confirmButtonClass: "btn btn-success",
        cancelButtonClass: "btn btn-danger",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    }).then(yesCallBack, noCallBack);
};

proj.services.swal.alertWrongDateRange = function () {
    swal({
        title: "Incorrect Date Range"
        , text: "Please revise your dates"
        , type: "error"
        , confirmButtonClass: 'btn btn-danger'
        , confirmButtonText: "Ok"
        , showCancelButton: false
    })
};

/* Added for the Admin Blogs page. - Yeg */

proj.services.swal.missingContentorTag = function () {
    swal({
        title: "Incomplete"
        , text: "Need to add a content & at least one tag"
        , type: "error"
        , confirmButtonClass: 'btn btn-danger'
        , confirmButtonText: "Ok"
        , showCancelButton: false
    })
};