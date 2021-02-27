var langs =
    [['Afrikaans', ['af-ZA']],
        ['Bahasa Indonesia', ['id-ID']],
        ['Bahasa Melayu', ['ms-MY']],
        ['Català', ['ca-ES']],
        ['Čeština', ['cs-CZ']],
        ['Deutsch', ['de-DE']],
        ['English', ['en-AU', 'Australia'],
            ['en-CA', 'Canada'],
            ['en-IN', 'India'],
            ['en-NZ', 'New Zealand'],
            ['en-ZA', 'South Africa'],
            ['en-GB', 'United Kingdom'],
            ['en-US', 'United States']],
        ['Español', ['es-AR', 'Argentina'],
            ['es-BO', 'Bolivia'],
            ['es-CL', 'Chile'],
            ['es-CO', 'Colombia'],
            ['es-CR', 'Costa Rica'],
            ['es-EC', 'Ecuador'],
            ['es-SV', 'El Salvador'],
            ['es-ES', 'España'],
            ['es-US', 'Estados Unidos'],
            ['es-GT', 'Guatemala'],
            ['es-HN', 'Honduras'],
            ['es-MX', 'México'],
            ['es-NI', 'Nicaragua'],
            ['es-PA', 'Panamá'],
            ['es-PY', 'Paraguay'],
            ['es-PE', 'Perú'],
            ['es-PR', 'Puerto Rico'],
            ['es-DO', 'República Dominicana'],
            ['es-UY', 'Uruguay'],
            ['es-VE', 'Venezuela']],
        ['Euskara', ['eu-ES']],
        ['Français', ['fr-FR']],
        ['Galego', ['gl-ES']],
        ['Hrvatski', ['hr_HR']],
        ['IsiZulu', ['zu-ZA']],
        ['Íslenska', ['is-IS']],
        ['Italiano', ['it-IT', 'Italia'],
            ['it-CH', 'Svizzera']],
        ['Magyar', ['hu-HU']],
        ['Nederlands', ['nl-NL']],
        ['Norsk bokmål', ['nb-NO']],
        ['Polski', ['pl-PL']],
        ['Português', ['pt-BR', 'Brasil'],
            ['pt-PT', 'Portugal']],
        ['Română', ['ro-RO']],
        ['Slovenčina', ['sk-SK']],
        ['Suomi', ['fi-FI']],
        ['Svenska', ['sv-SE']],
        ['Türkçe', ['tr-TR']],
        ['български', ['bg-BG']],
        ['Pусский', ['ru-RU']],
        ['Српски', ['sr-RS']],
        ['한국어', ['ko-KR']],
        ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
            ['cmn-Hans-HK', '普通话 (香港)'],
            ['cmn-Hant-TW', '中文 (台灣)'],
            ['yue-Hant-HK', '粵語 (香港)']],
        ['日本語', ['ja-JP']],
        ['Lingua latīna', ['la']]];

let recording = false;
let selectedLang = undefined;
let favouriteLanguages = [];

ws = new WebSocket("ws://localhost:5000");



ws.onmessage = (recv) => {


    let langs = recv.data.split(",");
    if (langs[0] !== "") {
        favouriteLanguages = langs;
        createSettnFavs(favouriteLanguages);
    }

};

function createSettnFavs(favlangs) {

    langsDiv = $("#fav-langs-group");
    settingLangsDiv = $("#setting-fav-lang-group");

    langsDiv.empty();
    settingLangsDiv.empty();

    langsDiv.append($("<div class='seperator' id='favlang-seperator'>Favourites</div>"));

    favouriteLanguages = favlangs;
    favlangs.forEach((item) => {

        langsDiv.append($("<div class='button favlang' title='" + item + "'>" + item + "</div>"));
        settingLangsDiv.append($("<div class='button set-favlang' title='" + item + "'>" + item + "</div>"));

    });

    $(".favlang").ready((event) => {
        selectedLang = $($(".favlang")[0]).attr('title');
        $($(".favlang")[0]).css('background', 'burlywood')
    });

}

function favLangHandler() {

    createSettnFavs(favouriteLanguages);

    $("#fav-langs-group").on('click', '.favlang', (event) => {

        $('.favlang').css('background', 'dodgerblue');
        $(event.target).css('background', 'burlywood');
        selectedLang = $(event.target).attr("title");

    });

    $("#setting-fav-lang-group").on('click', '.set-favlang', (event) => {
        event.target.remove();
        let ind = favouriteLanguages.indexOf($(event.target).attr('title'));
        if (ind !== -1) favouriteLanguages.splice(ind, 1);
        createSettnFavs(favouriteLanguages);
        updateFavLangData();
    });

}

function updateFavLangData() {
    ws.send(str2bin("FAV?" + favouriteLanguages.toString()));
}


function str2bin(input) {

    let output = "";

    for (var i = 0; i < input.length; i++) {
        output += input[i].charCodeAt(0).toString(2) + " ";
    }

    return output;
}


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'tr-TR';
recognition.interimResults = true;

var rec = false;


function stopRec() {
    recognition.stop();
    $("#onof-btn").text("Start Typing");
    $("#py-onof").text("off");
    rec = false;
}

function startRec() {
    recognition.lang = selectedLang;
    recognition.start();
    $("#onof-btn").text("Typing...");
    $("#py-onof").text("on");
    rec = true;
}

$(document).ready(() => {

    $("#onof-btn").on('click', (event) => {

        if (!rec) {
            if (favouriteLanguages.length !== 0) {
                startRec();
                $(event.target).css('background', 'limegreen');
            } else {
                alert("Please select a language!");
            }

        } else {
            stopRec();
            $(event.target).removeAttr('style');
        }

    });


    $("#open-setting").on('click', () => {
        settingSide(1);
    });

    $("#typedsofar").on('click', () => {
        settingSide(0);
    });


    for (var i = 0; i < langs.length; i++) {
        $("#lange").append($("<option value=" + i + ">" + langs[i][0] + "</option>"));
    }

    $("#lange").on('change', (event) => {
        recognition.stop();

        $("#lange2").remove();

        let ind = event.target.value;

        $("#lang-div").append($("<select id=\"lange2\"></select>"));

        for (var i = 1; i < langs[ind].length; i++) {

            $("#lange2").append($("<option value=" + i + ">" + langs[ind][i][0] + "</option>"));

        }

        selectedLang = langs[ind][1][0];

        $("#lange2").on('change', (event) => {
            let new_chs = langs[ind][event.target.value][0];
            selectedLang = new_chs;
        });

    });


    $("#add-fav").on('click', () => {

        if (favouriteLanguages.indexOf(selectedLang) === -1 && selectedLang !== undefined) {
            favouriteLanguages.push(selectedLang);
            createSettnFavs(favouriteLanguages);
            updateFavLangData();
        }
    });

    favLangHandler();

});


function settingSide(action) {
    settingBar = $("#setting");
    mainBar = $("#main");

    if (action === 1) {
        mainBar.css("left", "-210");
        settingBar.css("left", "0");
    } else {
        mainBar.css("left", "0");
        settingBar.css("left", "-210");
    }

}


var final_transcript = "";


recognition.onresult = (event) => {

    let interim_transcript = "";

    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;


            ws.send(str2bin("RES?" + final_transcript + "?1"));


            $("#typedsofar").append($("<div class='confident-results'>" + final_transcript + "<div>"));
            final_transcript = "";
        } else {
            interim_transcript += event.results[i][0].transcript;

        }
    }

    if (interim_transcript !== "") {
        ws.send(str2bin("RES?" + interim_transcript + "?0"));
    }


};

recognition.onend = () => {


};
