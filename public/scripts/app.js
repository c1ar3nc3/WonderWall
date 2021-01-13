const { response } = require("express");

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});


//---------Refresh Cards DIV with new params------------
$(document).ready(() => {
  $( "button" ).click(function(e) {
    let $target = $(e.target);
    let categoryId = $target.data("value");
  $.ajax({
    method: "GET",
    url: `/sort/${categoryId}`
  }).done((category) => {
    $.ajax({
      method: "POST",
      url: "/new_post/create"
    }).done((posts) => {
      $(".row").load(window.location + " .row");
    })
    // $(".row").text(category).appendTo($(".row"));
  });;
  })
});
