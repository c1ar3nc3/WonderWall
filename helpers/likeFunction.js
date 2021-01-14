
// send to like (post)
// use userID, postID, like (boolean)
// update or insert entry


$(".like-Unlike").click(function (e) {
  $.post('/like', {userid: id, postID: pid, likes: true})
.then((res) => {
   // ...if logic here
  if ($(this).html() == "Like") {
      $(this).html('Unlike');
  }
  else {
      $(this).html('Like');
  }
}).catch(error => {
  // logic when it doesn't work. i.e. notify user or log error
});
  });
