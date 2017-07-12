function toggleDone() {
  var checkbox = this;
  var tableRow = $(this).parent().parent();

  var todoId = tableRow.data('id');
  var isCompleted = !tableRow.hasClass("success");


  $.ajax({
    type: "PUT",
    url: "/todos/" + todoId + ".json",
    data: JSON.stringify({
      todo: { completed: isCompleted }
    }),
    contentType: "application/json",
    dataType: "json"})

    .done(function(data) {
      console.log(data);

      tableRow.toggleClass("success", data.completed);

      updateCounters();
    });
}

function updateCounters() {
  $("#total-count").html($(".todo").size());
  $("#completed-count").html($(".success").size());
  $("#todo-count").html($(".todo").size() - $(".success").size());
}

function createTodo(title) {
  var newTodo = { title: title, completed: false };

  $.ajax({
    type: "POST",
    url: "/todos.json",
    data: JSON.stringify({
      todo: newTodo
    }),
    contentType: "application/json",
    dataType: "json"
  })
  .done(function(data) {
    console.log(data);

    var checkboxId = data.id;

    var label = $('<label></label>')
      .attr('for', checkboxId)
      .html(title);

    var checkbox = $('<input type="checkbox" value="1" />')
      .attr('id', checkboxId)
      .bind('change', toggleDone);

    var tableRow = $('<tr class="todo"></td>')
      .attr('data-id', checkboxId)
      .append($('<td>').append(checkbox))
      .append($('<td>').append(label));

    $("#todoList").append(tableRow);

    updateCounters();
  })

  .fail(function(error) {
    console.log(error)
    error_message = error.responseJSON.title[0];
    showError(error_message);
  })

  function showError(message) {
    var errorHelpBlock = $('<span class="help-block"></span>')
      .attr('id', 'error_message')
      .text(message);

    $("#formgroup-title")
      .addClass("has-error")
      .append(errorHelpBlock);
  }
}


function resetErrors() {
  $("#error_message").remove();
  $("#formgroup-title").removeClass("has-error");
}

function submitTodo(event) {
  event.preventDefault();
  resetErrors();

  createTodo($("#todo_title").val());
  $("#todo_title").val(null);
  updateCounters();
}

function cleanUpDoneTodos(event) {
  event.preventDefault();
  $.when($(".success").remove())
    .then(updateCounters);
}

$(document).ready(function() {
  $("input[type=checkbox]").bind('change', toggleDone);
  $("form").bind('submit', submitTodo);
  $("#clean-up").bind('click', cleanUpDoneTodos);
  updateCounters();
});
