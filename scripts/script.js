/*GLOBAL VARIABLES BEGINS*/
const html = document.documentElement;
const body = document.body;
const links = [{}]; //object literal containing all samepage links
/*GLOBAL VARIABLES ENDS*/

/*TIMELINE TRANSITION*/
function yearchange(years, current) {
    const timelineYear = document.getElementsByClassName("section-timeline__contents-year");
    const timelinePara = document.getElementsByClassName("section-timeline__contents-p");
    const radioGroup = document.getElementsByClassName("section-timeline__radio-group");
    const innerspan = current.parentElement.children[1].children[1];
    const details = document.getElementsByClassName(years);

    //hide the partial borders for all the dates in the timeline
    for (z = 0; z < radioGroup.length; z++)
        radioGroup[z].children[1].children[1].className = "";

    //show partial borders for the selected dates
    innerspan.className = "partial-smallbox__top partial-smallbox__bottom";

    //hide all timeline details (year and paragrach)
    for (j = 0; j < timelineYear.length; j++) {
        timelineYear[j].style.opacity = 0;
        timelinePara[j].style.opacity = 0;
    }
    //show selected year and corresponding paragraph
    for (i = 0; i < details.length; i++)
        details[i].style.opacity = 1;
};


/*HIGHLIGHTING CURRENT LINK BEGINGS*/

window.onload = function () {
    const linksEl = document.links;
    let index = 0;
    for (let m = 0; m < linksEl.length; m++) {
        //grabs all samepage links
        if (linksEl[m].hash != "") {
            links[index] = {
                link: linksEl[m],
                targetPosition: null,
                target: document.getElementById(linksEl[m].hash.substring(1))
            }
            //get the position of the target elements
            let anchor = links[index].target;
            let pos = 0;
            while (anchor.offsetParent) {
                pos += anchor.offsetTop;
                anchor = anchor.offsetParent;
            }
            pos = Math.floor((Math.round(pos)) / 10);
            links[index].targetPosition = pos;
            index += 1;
        }
    }

    //the link to be highlited in the navigation menu
    let navLink;

    //get target for samepage links only
    links.forEach(linkEl => {
        linkEl.link.onclick = function (e) {
            e.preventDefault();
            if (!this.className.toLowerCase().includes("navigation__link")) {
                //gets the navigation link that corresponds to section currently being viewed
                navLink = getNavlink(this.hash.substring(1), "navigation__link");
            } else navLink = this;

            linkHighlight("current", navLink);
        };
    });

};

window.onresize = function (e) {
    //updates the positions of the sections targeted by samepage links
    links.forEach(function (linkEl) {
        let anchor = linkEl.target;
        let pos = 0;
        while (anchor.offsetParent) {
            pos += anchor.offsetTop;
            anchor = anchor.offsetParent;
        }
        pos = Math.floor((Math.round(pos)) / 10);
        linkEl.targetPosition = pos;
    });
};

window.onscroll = function (e) {
    //the current scrolled to position
    let currentPos = Math.floor((Math.round(body.scrollTop || html.scrollTop)) / 10);

    for (let i = 0; i < links.length; i++) {
        //if the scroll position is near a target element
        if ((currentPos <= Math.abs(links[i].targetPosition + 15) && currentPos >= Math.abs(links[i].targetPosition - 15)) || currentPos == links[i].targetPosition) {
            //highlight the nav link that corresponds to the section currently being viewed
            if (links[i].link.classList.contains("navigation__link"))
                linkHighlight("current", links[i].link);
        }
    }
};

function linkHighlight(current, obj) {
    //removes the "current" class from all of the other links
    links.forEach(function (linkEl) {
        if (linkEl.link.classList.contains(current.trim())) {
            linkEl.link.classList.remove(current.trim());
        }
    });

    //add the class "current" to the corresponding link
    obj.classList.add(current.trim());
}

function getNavlink(ref, classname) {
    //    returns the link element with the matching href and classname
    for (let j = 0; j < links.length; j++) {
        if (links[j].link.className.includes(classname)) {
            if (links[j].link.hash.substring(1).toLowerCase().trim() === ref.toLowerCase().trim()) {
                return links[j].link;
            }
        }
    }
    return null;
};
/*HIGHLIGHTING CURRENT LINK ENDS*/


/*AJAX SUBMIT*/
function formsubmit() {
    const submitError = document.getElementsByClassName("submit-error")[0];
    const statusInfo = document.getElementById("contactmeform").querySelector("h3");
    const formdata = new FormData();
    const email = document.getElementById("email");
    const name = document.getElementById("name");
    const message = document.getElementById("message");
    const sendbtn = document.getElementById("sendbtn");

    //disabled just in case so the user doesn't send same data multiple times
    sendbtn.disabled = true;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "send.php");

    formdata.append("email", email.value);
    formdata.append("name", name.value);
    formdata.append("message", message.value);

    xhr.onprogress = function () {
        statusInfo.innerHTML = "Sending...";
    };

    xhr.onload = function (e) {
        if (this.status == 200) {
            if (this.responseText == "success") {
                statusInfo.innerHTML = "message sent!";

                //clear the contact form
                setTimeout(function () {
                    statusInfo.innerHTML = null;
                }, 3000);
                submitError.innerHTML = "";
                email.value = email.defaultValue;
                name.value = name.defaultValue;
                message.value = message.defaultValue;
            } else if (this.responseText.toLowerCase().substring(0).includes("invalid email")) {
                statusInfo.innerHTML = "message not sent!";
                submitError.innerHTML = "Invalid Email format!";
            } else {
                statusInfo.innerHTML = "error! message not sent!";
                submitError.innerHTML = "";
            }
        }
        sendbtn.disabled = false;
    };

    xhr.onerror = function () {
        statusInfo.innerHTML = "something went horribly wrong!";
        sendbtn.disabled = false;
    };

    xhr.send(formdata);
}


//CLOSE NAVIGATION IF CLICK OUTSIDE OF IT
document.getElementById("navi-toggle").addEventListener('change', function (e) {
    const nav = document.querySelector('nav');
    const self = this;
    if (this.checked) {
        window.addEventListener('click', function (e) {
            if (!self.parentNode.contains(e.target)) {
                self.checked = false;
            }
        });
    }
});
