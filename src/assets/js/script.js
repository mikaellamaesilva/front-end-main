searchVisible = 0;
transparent = true;

$(document).ready(function () {

    /*  Activate the tooltips      */
    $('[rel="tooltip"]').tooltip();

    // Code for the Validator
    var $validator = $('.wizard-card form').validate({
        rules: {
            firstname: {
                required: true,
                minlength: 3
            },
            lastname: {
                required: true,
                minlength: 3
            },
            birthDate: {
                required: true,
            },
            age: {
                required: true,
                minlength: 2
            },
            gender: {
                required: true
            },
            address: {
                required: true
            },
            country: {
                required: true
            },
            phoneNumber: {
                required: true
            },
            upliveName: {
                required: true
            },
            upliveId: {
                required: true
            },
            password: {
                required: true
            },
            confirmPassword: {
                required: true
            },
            email: {
                required: true
            },
            talentManager: {
                required: true
            },
            referral: {
                required: true
            },
            specialTalent: {
                required: true
            },
            videoLink: {
                required: true
            }
        },
    });

    // Wizard Initialization
    $('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function (tab, navigation, index) {
            var $valid = $('.wizard-card form').valid();
            if (!$valid) {
                $validator.focusInvalid();
                return false;
            }
        },

        onInit: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            $width = 100 / $total;
            navigation.find('li').css('width', $width + '%');
        },

        onTabClick: function (tab, navigation, index) {
            var $valid = $('.wizard-card form').valid();
            if (!$valid) {
                return false;
            } else {
                return true;
            }
        },

        onTabShow: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;

            var $wizard = navigation.closest('.wizard-card');

            if ($current >= $total) {
                $($wizard).find('.btn-next').hide();
                $($wizard).find('.btn-finish').show();
            } else {
                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            var move_distance = 100 / $total;
            move_distance = move_distance * (index) + move_distance / 2;

            $wizard.find($('.progress-bar')).css({
                width: move_distance + '%'
            });

            $wizard.find($('.wizard-card .nav-pills li.active a .icon-circle')).addClass('checked');
        }
    });
});