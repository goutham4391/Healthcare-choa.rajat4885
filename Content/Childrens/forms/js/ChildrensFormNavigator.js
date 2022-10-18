var debug;

$(function () {
    $(".form-step:first").fadeIn(function () { //load first page and do preliminary set up.
        $(this).find(".hidden-field").each(function () {
            if (!$(this).hasClass("shown")) {
                $(this).hide();
                hideDiv($(this)); //false because this is not a trigger, this is default
            }
        });

        //change default validator message
        jQuery.extend(jQuery.validator.messages, {
            required: "Required"
        });

        refreshpage($(".form-step:first"));
    });

    $('.datepicker').datetimepicker({ format: 'MM/DD/YYYY' })

    $(".previous-link").click(function (event) {
        event.preventDefault();
        if ($(".page-button-link.active").index() <= 1)
            return;
        formStepBack();
        if ($(this).parent().hasClass("below"))
            $(window).scrollTop($(".formSection form").offset().top + $(".formSection form").height() - $(window).height() + 10);
    });

    $(".next-link").click(function (event) {
        event.preventDefault();
        if ($(".form-step:visible").next().hasClass("form-step")) {
            formStepNext();
            if ($(this).parent().hasClass("below"))
                $(window).scrollTop($(".formSection form").offset().top + $(".formSection form").height() - $(window).height() + 10);
        }
        else
            $("#next-step").focus().select();
    });

    // attach backStep button handler
    // hide on first step
    $("#back-step").hide().click(function () {
        formStepBack();
    });

    //any input click events
    $(".formSection input").click(function () {
        if ($(this).attr("type") == "radio") {
            $(".formSection form").validate().element($(this));
        }
        //remove validation from checkbox "groups"
        if ($(this).attr("type") == "checkbox") {
            $(this).parent().parent(".checkbox-list").find("input[type=checkbox]").each(function () {
                $(this).rules("remove", "required")
                $("form").validate().element($(this));
            })
        }
    });

    //revalidate on change
    $(".formSection select, .formSection textarea").change(function () {
        $(".formSection form").validate().element($(this));
    });

    $(".checkboxtogglehidden").change(function () {
        var field = $(this).parent().next(".hidden-field");
        if ($(this).is(":checked")) {
            showDiv(field);
        }
        else {
            hideDiv(field);
        }
    });

    $(".radioshowhidden").change(function () {
        var field = $(this).parent().next(".hidden-field");
        showDiv(field);
    });

    $(".radiohidehidden").change(function () {
        var field = $(this).parent().next(".hidden-field");
        hideDiv(field);
    });

    $(".otherlist").change(function () {
        showFieldsFromListSelection($(this), "Other");
    });

    $(".yeslist").change(function () {
        if ($("#custom-form").attr("data-resource-lang") == "Spanish")
            showFieldsFromListSelection($(this), "Sí");
        else
            showFieldsFromListSelection($(this), "Yes");
    });

    $(".textboxshowhidden").keyup(function () {
        if ($(this).val().length > 0 && !$(this).parent().next(".hidden-field").hasClass("shown")) {
            var field = $(this).parent().next(".hidden-field");
            showDiv(field);
        }
        else if ($(this).val().length == 0) {
            var field = $(this).parent().next(".hidden-field");
            hideDiv(field);
        }
    });

    // attach nextStep button handler
    $("#next-step").click(function () {
        formStepNext();
    });

    $(".page-button-link").click(function (event) {
        event.preventDefault(); //we only want our script handling page nav
        $clickedLink = $(this);
        if ($clickedLink.hasClass("disabled") || $clickedLink.hasClass("active"))
            return;
        if (($(".page-button-link.active").index() < $(this).index()) && !validatePage($(".form-step:visible")))
            return;
        $(".form-step:visible").hide();
        var index = 0;
        $(".pagination.above").find(".page-button-link.active").removeClass("active");
        $(".pagination.below").find(".page-button-link.active").removeClass("active");
        var index = $(this).index() - 1;
        $(".form-step:eq(" + index + ")").show();
        $(".pagination.above").find(".page-button-link:eq(" + index + ")").addClass("active");
        $(".pagination.below").find(".page-button-link:eq(" + index + ")").addClass("active");
        if (!$(".form-step:visible").next().hasClass("form-step")) { //update button if page is last page
            $("#next-step").attr("value", "Submit >")
        }
        else {
            $("#next-step").attr("value", "Continue >")
        }
        if (!$(".form-step:visible").prev().hasClass("form-step")) {
            $("#back-step").hide();
        }
        else {
            $("#back-step").show();
        }
        if ($clickedLink.parent().hasClass("above")) {
            $(window).scrollTop($(".formSection form").offset().top); //top
        }
        else {
            $(window).scrollTop($(".formSection form").offset().top + $(".formSection form").height() - $(window).height() + 10); //scroll to bottom section of form
        }
    });
});

//Hides the current view and shows the previous one.
function formStepBack() {
    //Sets page nav visual on top and bottom back one section
    $(".pagination.above, .pagination.below").find(".page-button-link.active").removeClass("active").prev().addClass("active");

    var $step = $(".form-step:visible"); // get current step
    if ($step.prev().hasClass("form-step")) { // is there any previous step?

        //**** SHOW PREVIOUS AND HIDE CURRENT *******//
        $step.hide().prev().fadeIn();
        $(window).scrollTop($(".formSection form").offset().top); //scroll to top of the form

        // disable backstep button?
        if (!$step.prev().prev().hasClass("form-step")) {
            $("#back-step").hide();
        }
        $("#next-step").attr("value", "Continue >");
    }
}

//Does validation (Goes through each field that can be validated including checkbox lists
//Then shows the view of the next page and hides the current one, or submits the form when this is the last form-step
function formStepNext() {
    var $step = $(".form-step:visible");
    if (!validatePage($step))
        return false;

    if ($step.next().hasClass("form-step")) { // is there any next step?
        //This updates the above and below page navigation states setting the next one active and deactivating the one we were last on
        $(".pagination.above, .pagination.below").find(".page-button-link.active").removeClass("active").next().addClass("active").removeClass("disabled");

        //**** HIDE THIS PAGE AND SHOW THE NEXT *****//
        $step.hide().next().fadeIn();
        $(window).scrollTop($(".formSection form").offset().top); //scroll to top of the form

        $("#back-step").show();   // recall to show backStep button
        if (!$step.next().next().hasClass("form-step")) {
            $("#next-step").attr("value", "Submit >")
        }
        else {
            $("#next-step").attr("value", "Continue >")
        }
    }
    else { // this is last step, submit form
        if (debug)
            return;
        $(".formSection form").submit();
    }

    if ($step.next().attr("visited") == undefined) {
        $step.next().find(".hidden-field").each(function () {
            if (!$(this).hasClass("shown")) {
                $(this).hide();
                removeDivValidators($(this)); //must execute so they're assumed to be ready
            }
        });
    }

    $step.next().attr("visited", true);
    refreshpage($step.next());
}

//goes through each element on the visible page of the form and focuses any field that is not valid, returning false
function validatePage($step) {
    $("[first-error=true]").removeAttr("first-error");
    var anyError = false;
    var validator = $(".formSection form").validate(); // obtain validator

    $step.find("input, textarea, select").each(function () {
        if (($(this).rules().required != undefined || requiredIf($(this))) && !$(this).is(":checkbox")) //checkbox done later
            if (!validator.element(this)) { // validate every input element inside this step
                if (!anyError)
                    $(this).focus().select();//$(this).attr("first-error", true);
                anyError = true;
            }
    });

    //Checkbox-list (pick one validation)
    $step.find(".checkbox-list:visible").each(function () {
        var checked = false;
        $(this).find("input[type=checkbox]").each(function () {
            if ($(this).is(":checked"))
                checked = true;
        })
        if (!checked) {
            jQuery.extend(jQuery.validator.messages, { //required message is "pick one"
                required: "*(Pick one)"
            });
            $(this).find("input[type=checkbox]").each(function () {
                $(this).rules("add", "required");
                validator.element($(this));
                jQuery.extend(jQuery.validator.messages, {  //simplify message
                    required: "*"
                });
            });
            jQuery.extend(jQuery.validator.messages, { //return to default message
                required: "Required"
            });
            if (!anyError) {
                $(this).find("input[type=checkbox]").first().focus().select();
                anyError = true;
            }
        }
    });

    //validate checkbox for meridian mark pre anesthesia form patient and parent rights and responsibilities
    $step.find(".patient-parent-rights:visible").each(function () {
        var checked = false;
        $(this).find("input[type=checkbox]").each(function () {
            if ($(this).is(":checked"))
                checked = true;
        })
        if (!checked) {
            jQuery.extend(jQuery.validator.messages, { //required message is "pick one"
                required: "*Please read and accept the Patient and Parent Rights and Responsibilities"
            });
            $(this).find("input[type=checkbox]").each(function () {
                $(this).rules("add", "required");
                validator.element($(this));
                jQuery.extend(jQuery.validator.messages, {  //simplify message
                    required: "*"
                });
            });
            jQuery.extend(jQuery.validator.messages, { //return to default message
                required: "Required"
            });
            if (!anyError) {
                $(this).find("input[type=checkbox]").first().focus().select();
                anyError = true;
            }
        }
    });

    if (anyError && !debug)
        return false; // error found       
    return true; //no error
}

function selectErrorField(element, anyError) {
    if (anyError)
        return;
    element.select();
    element.focus();
}

function showFieldsFromListSelection(list, selection) {
    if (list.val() == selection) {
        var field = list.parent().next(".hidden-field");
        showDiv(field);
    }
    else {
        var field = list.parent().next(".hidden-field");
        hideDiv(field);
    }
}

//cycles through all the elements on the page that can hide fields and triggers a change to display them if they're selected
function refreshpage(page) {
    page.find(".checkboxtogglehidden").each(function () {
        $(this).trigger("change"); //the status is checked in the change trigger
    });
    page.find(".radioshowhidden").each(function () {
        if ($(this).is(":checked")) //need to make sure it's selected
            $(this).trigger("change");
    });
    page.find(".otherlist").each(function () {
        $(this).trigger("change");
    });
}

//requiredIf is active check
function requiredIf(field) {
    if (field.attr("data-val-requiredif") != undefined)
        if (field.attr("required-hidden") == "false") //can't validate it if it's hidden
            return true;
    return false;
}

function hideDiv(div) {
    div.slideUp();
    removeDivValidators(div); //removes validation for all elements contained
}

//does the opposite function from hideDiv
function showDiv(div) {
    div.slideDown(); //show
    addDivValidators(div);
}

//removes validators on input that is hidden (add more field types as needed)
function removeDivValidators(div) {
    div.find("textarea").each(function () {
        if ($(this).rules().required || $(this).attr("data-val-requiredif") != undefined) {
            $(this).rules("remove", "required");
            $(this).attr("required-hidden", true);
        }
    });
    div.find("input").each(function () {
        if ($(this).rules().required || $(this).attr("data-val-requiredif") != undefined) {
            $(this).rules("remove", "required");
            $(this).attr("required-hidden", true);
        }
    });
    div.find("select").each(function () {
        if ($(this).rules().required || $(this).attr("data-val-requiredif") != undefined) {
            $(this).rules("remove", "required");
            $(this).attr("required-hidden", true);
        }
    });
}

//adds validators on input that has been shown (add more field types as needed)
function addDivValidators(div) {
    div.find("textarea").each(function () {
        if ($(this).attr("required-hidden") != undefined && $(this).is(":visible")) {
            $(this).rules("add", "required")
            $(this).attr("required-hidden", false);
        }
    });
    div.find("input").each(function () {
        if ($(this).attr("required-hidden") != undefined && $(this).is(":visible")) {
            $(this).rules("add", "required")
            $(this).attr("required-hidden", false);
        }
    });
    div.find("select").each(function () {
        if ($(this).attr("required-hidden") != undefined && $(this).is(":visible")) {
            $(this).rules("add", "required")
            $(this).attr("required-hidden", false);
        }
    });
}