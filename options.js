// Saves options to chrome.storage
function save_options() {
  var city = document.getElementById('city').value;
  chrome.storage.sync.set({
    city: city
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function load_options() {
  chrome.storage.sync.get('city', function(items) {
    document.getElementById('city').value = items.city;
  });
}

document.addEventListener("DOMContentLoaded", function(event) { 
  load_options();
});
document.getElementById('save').addEventListener('click', save_options);

