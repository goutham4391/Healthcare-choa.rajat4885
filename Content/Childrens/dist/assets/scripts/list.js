$(document).ready(function () {

    //______________________________________________________________________________________

    // Bulleted list columns in accordions - dynamic styling

    function listColumns() {

        $(".accordion_content ul.list-bulleted-col:odd, .panel-body ul.list-bulleted-col:odd, .panel-body .richtext-content ul.list-bulleted-col:odd").each(function () {
            if ($(window).width() <= 480) {
                $(this).css({
                    'padding-left': '15px'
                });
            }
            else if ($(window).width() <= 767) {
                $(this).css({
                    'margin-bottom': '10px',
                    'padding-left': '40px'
                });
            } else if ($(window).width() > 767) {
                $(this).css({
                    'padding-left': '20px'
                });
            }
        });

    }

    if ($('*').hasClass('list-bulleted-col')) {
        listColumns();
    }


    //______________________________________________________________________________________

    // Board of Trustees Page

    // Split list into two columns

    function trusteesList() {
        var boardArr = [],
		$boardList = $('ul.two-col');

        //Create array of all posts in lists
        $boardList.find('li.profile').each(function () {
            boardArr.push($(this).html());
        });

        //Split the array at this point. The original array is altered.
        var firstBoardList = boardArr.splice(0, Math.round(boardArr.length / 2)),
		secondBoardList = boardArr,
		boardListHTML = '';

        function createBoardHTML(boardlist) {
            boardListHTML = '';
            for (var i = 0; i < boardlist.length; i++) {
                boardListHTML += '<li class="profile">' + boardlist[i] + '</li>';
            }
        }
        //Generate HTML for first list
        createBoardHTML(firstBoardList);
        $boardList.html(boardListHTML);
        //Generate HTML for second list
        createBoardHTML(secondBoardList);
        //Create new list after original one
        $boardList.after('<ul class="two-col"></ul>').next().html(boardListHTML);
    }

    if ($('.grid-container').attr('id') === 'board-members') {
        trusteesList();
    }


    //______________________________________________________________________________________

    // Medical Services Landing Page - Additional Links at bottom of page

    // Split list into two columns

    function addLinks() {
        var addLinksArr = [],
		$addLinksList = $('ul.two-col');

        //Create array of all posts in lists
        $addLinksList.find('li').each(function () {
            addLinksArr.push($(this).html());
        });

        //Split the array at this point. The original array is altered.
        var firstLinkList = addLinksArr.splice(0, Math.round(addLinksArr.length / 2)),
		secondLinkList = addLinksArr,
		linkListHTML = '';

        function createLinkListHTML(linkList) {
            linkListHTML = '';
            for (var i = 0; i < linkList.length; i++) {
                linkListHTML += '<li>' + linkList[i] + '</li>';
            }
        }
        //Generate HTML for first list
        createLinkListHTML(firstLinkList);
        $addLinksList.html(linkListHTML);
        //Generate HTML for second list
        createLinkListHTML(secondLinkList);
        //Create new list after original one
        $addLinksList.after('<ul class="two-col"></ul>').next().html(linkListHTML);

        $('.addLinks_container').css('visibility', 'visible');
    }

    if ($('*').hasClass('addLinks_container')) {
        addLinks();
    }


    //______________________________________________________________________________________

    // Set Height for background image in additional link container - medical services landing page

    function addLinksHeight() {

        var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // Reset image height style
        $('.addLinks_container .relatedContainer').removeAttr("style");

        // Set image height based on parent container height - only at 768px and up
        if (docSizeWidth >= 768) {
            var linksContainerHeight = $('.addLinks_container').height();
            $('.addLinks_container .relatedContainer').css({
                'height': linksContainerHeight
            });
        }
    }

    if ($('*').hasClass('addLinks_container')) {
        addLinksHeight();
    }


    //______________________________________________________________________________________

    // $('.dropdown-menu .yamm-content ul').each(function() {
    // 	$(this).find('li a').slice(5).css("background-color", "yellow");

    // 	var yummy = $(this).find('li a').slice(5);

    // 	yummy.remove();

    // });



    //______________________________________________________________________________________

    // Run scripts on window resize

    $(window).resize(function () {

        // Style second bulleted list column

        listColumns();

        //______________________________________________________________________________________

        // Set size of additional links container image

        addLinksHeight();

        //______________________________________________________________________________________

        // NEXT SCRIPT TO RUN ON RESIZE




    }); //END Window Resize function






});