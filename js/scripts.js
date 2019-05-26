var myCourses = [];

function reqCount(theReq) {
    var count = 0;
    for (var i = 0; i < myCourses.length; i++) {
        if (myCourses[i].req == theReq) {
            count++
        }
    }
    return count;
}

function fullRecName(name){
    if(name=='EN') return "English";
    if(name=='MA') return "Math";
    if(name=='SC') return "Science";
    if(name=='FL') return "World Languages";
    if(name=='AD') return "Dance";
    if(name=='AM') return "Music";
    if(name=='AV') return "Visual";
    if(name=='AP') return "Theatre";
    if(name=='HI') return "History";
    if(name=='CT') return "CompThinking/AI";
    if(name=='IN') return "Innovations";
    if(name=='EF') return "Entreprenurship/FL";
    if(name=='HE') return "Health";
    if(name=='RE') return "Rhetoric";
    return name;
}
function updateReqsList() {
    var reqlist = "";
    for (var i = 0; i < reqs.length; i++) {
        reqlist += '<li class="list-group-item py-1">';
        reqlist += '<div class="progress">';
        reqlist += '<div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width:'
        reqlist += (((reqCount(reqs[i].name) / reqs[i].count) * 100)).toString();
        reqlist += '%">'
        name = fullRecName(reqs[i].name);
        reqlist += name + ' ' + reqCount(reqs[i].name) + '/' + reqs[i].count;
        reqlist += '</div>' //close .progress-bar div
        reqlist += '</div>' //close .progress div
        reqlist += "</li>";
    }
    cohort = $("#cohort option:selected").text();
    accum = accumList(cohort, myCourses);
    for (var i = 0; i < accum.length; i++) {
        if (accum[i] == undefined) continue;
        reqlist += '<li class="list-group-item py-1">';
        reqlist += '<div class="progress">';
        reqlist += '<div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width:'
        reqlist += ((accum[i].earned / accum[i].count) * 100);
        reqlist += '%">'
        reqlist += accum[i].name + ' ' + accum[i].earned + '/' + accum[i].count;
        reqlist += '</div>' //close .progress-bar div
        reqlist += '</div>' //close .progress div
        reqlist += "</li>";
    }
    $('#theReqs').html(reqlist);
}

function makeCoursesMenu() {
    var menu = "";
    for (var i = 0; i < courses.length; i++) {
        var item = '<button class="dropdown-item coursesitem" data-item=';
        item += i;
        item += '>' + courses[i].name + '</button>';
        menu += item;
    }
    return menu;
}


function addCourse() {
    var term = this.parentElement.getAttribute('data-term');
    var item = this.getAttribute('data-item');

    //FIXME:  copy element from array by value rather than extracting values
    let theCourse = {};
    theCourse.name = courses[item].name;
    theCourse.req = courses[item].req;
    theCourse.term = term;
    theCourse.time = Date.now();
    myCourses.push(theCourse);

    updateCourseList();
    updateReqsList(reqs);
}

function removeCourse() {
    var item = this.getAttribute('data-item');
    var removed = myCourses.splice(item, 1);
    updateCourseList(myCourses);
    updateReqsList(reqs);
}

function updateCourseList() {
    for (var theTerm = 1; theTerm <= 12; theTerm++) {
        var classlist = "";
        for (var i = 0; i < myCourses.length; i++) {
            if (myCourses[i].term == theTerm) {
                classlist += '<li class="list-group-item py-0 coursename">';
                classlist += myCourses[i].name;
                classlist += '<button type="button" class="close"';
                classlist += 'data-item=' + i + '>';
                classlist += '<span>&times;</span></button>'
                classlist += "</li>";
            }
        }
        $('.myCourses[data-term=' + theTerm + ']').html(classlist);
    }
    updateInOut();
}

function updateInOut() {
    var coursetext = "";
    for (var i = 0; i < myCourses.length; i++) {
        coursetext += myCourses[i].name;
        coursetext += ','
        coursetext += myCourses[i].req;
        coursetext += ','
        coursetext += myCourses[i].term;
        coursetext += '\n'
    }
    $("#inout").text(coursetext);

}

function importClassList() {
    var coursetext = $("#inout").text();
    var lines = coursetext.split('\n');
    myCourses = [];
    var course = {};
    for (var i = 0; i < lines.length; i++) {
        line = lines[i].split(',');
        if(line.length != 3) continue;
        course = {};
        course.name = line[0];
        course.req = line[1];
        course.term = line[2];
        course.time = Date.now();
        myCourses.push(course);
    }
    updateCourseList();
    updateReqsList(reqs);
}

function updateCohort() {
    cohort = $("#cohort option:selected").text();
    setRequirements(cohort);
    updateReqsList(reqs);

}

function updateDom(){
    console.log('updateDom',myCourses);
    updateCourseList();
    updateInOut();
}

$('nav').load('html/nav.html', loadmaincontainer);

function loadmaincontainer() {
    $('#users_menu').load('php/users_menu.php');
    $('#maincontainer').load('html/plan.html', loadterms);
}

function loadterms() {
    $('#terms').load('html/terms.html', startupscripts);
}

function startupscripts() {
    setRequirements("2022");
    updateReqsList(reqs);
    $(".course-menu").html(makeCoursesMenu(courses));
    $('body').on('click', '.coursesitem', addCourse);
    $('body').on('click', '.close', removeCourse);
    $('body').on('change', '#cohort', updateCohort);
    $('body').on('click', '#importclasslist', importClassList);
}