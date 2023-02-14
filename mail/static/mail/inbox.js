document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


 // submit mail in composer, from sender to reciepient
  submitButton = document.querySelector('#compose-form');
  submitButton.addEventListener('submit', submit);

  // By default, load the inbox
  load_mailbox('inbox');

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#viewEmail').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#viewEmail').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  // show mails for mailboxes

  fetchMail(mailbox);
    
}


function submit(event){

  //stop submit bttn from refreshing page by default
  event.preventDefault();

  //get reciepent(s) from input
  const getRecipients = document.querySelector('#compose-recipients').value;

  //get subject from input
  const getSubject = document.querySelector('#compose-subject').value;

  //get body from input
  const getBody = document.querySelector('#compose-body').value;

  //fetch using POST method
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: getRecipients,
        subject: getSubject,
        body: getBody
    })
  })
  .then(response => {
    if (!response.ok) {
        throw response;
    }
    return response.json();
})
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  })

  .catch(error => {
    error.json().then(errorMessage => {
        console.error(errorMessage);
        alert(errorMessage.error);
    });
});


};


function fetchMail(mailBox){
  fetch(`emails/${mailBox}`)
  .then(response => response.json())
  .then(email => {
        console.log(email);
        // create parent divs for mailboxes to toggle on and off
        const sentMailbox = document.createElement('div');
        sentMailbox.setAttribute('id', 'sentMailbox');
        document.querySelector('#emails-view').append(sentMailbox);


        const inboxMailbox = document.createElement('div');
        inboxMailbox.setAttribute('id', 'inboxMailbox');
        document.querySelector('#emails-view').append(inboxMailbox);

        const archiveMailbox = document.createElement('div');
        archiveMailbox.setAttribute('id', 'archiveMailbox');
        document.querySelector('#emails-view').append(archiveMailbox);



        //create mailbox for sent emails
        if(mailBox == 'sent'){
        //show sent mailbox and hide inbox mailbox
        sentMailbox.style.display = 'block';
        inboxMailbox.style.display = 'none';
        archiveMailbox.style.display = 'none';
        
        for(let i = 0; i < email.length; i++){
          
            //create container for sent mails
          const sentInboxContainer = document.createElement('div');
          sentMailbox.append(sentInboxContainer);
             //create element for recipient info
          const sentElementRecipients = document.createElement('h5');
          sentElementRecipients.innerHTML = `To: ${email[i].recipients}`;
          sentInboxContainer.append(sentElementRecipients);
             //create element for timestamp info
          const sentElementDate = document.createElement('h7');
          sentElementDate.innerHTML = `Date: ${email[i].timestamp}`;
          sentInboxContainer.append(sentElementDate);
            //create element for subjectline info
          const sentElementSubject = document.createElement('p');
          sentElementSubject.innerHTML = `Subject: ${email[i].subject}`;
          sentInboxContainer.append(sentElementSubject);


           //if mail is unread make it's subjectline background gray, else make it white

           if(email[i].read == true){
            sentInboxContainer.className = 'alert alert-secondary';
            sentInboxContainer.setAttribute('role', 'alert');
           }else{
            sentInboxContainer.className = 'alert alert-light';
              sentInboxContainer.setAttribute('role', 'alert');
           }
          
    

           //make subject div clickable
           sentInboxContainer.style.cursor="pointer";

           //add to every subject element eventListener
           sentInboxContainer.addEventListener('click', () => viewEmail(email[i].id));
        }
      } 

      if(mailBox == 'inbox'){
        sentMailbox.style.display = 'none';
        archiveMailbox.style.display = 'none';
        inboxMailbox.style.display = 'block';
      // doing same as sent inbox, but instead of classic for loop using forEach
        email.forEach(element => {

          const mainInboxContainer = document.createElement('div');
          inboxMailbox.append(mainInboxContainer);


          const inboxElementSentby = document.createElement('h5');
          inboxElementSentby.innerHTML = `From: ${element.sender}`;
          mainInboxContainer.append(inboxElementSentby);

          const inboxElementRecipients = document.createElement('h5');
          inboxElementRecipients.innerHTML = `To: ${element.recipients}`;
          mainInboxContainer.append(inboxElementRecipients);

          const inboxElementDate = document.createElement('h7');
          inboxElementDate.innerHTML = `Date: ${element.timestamp}`;
          mainInboxContainer.append(inboxElementDate);

          const inboxElementSubject = document.createElement('p');
          inboxElementSubject.innerHTML = `Subject: ${element.subject}`;
          mainInboxContainer.append(inboxElementSubject);

          if(element.read == true){
            mainInboxContainer.className = 'alert alert-secondary';
            mainInboxContainer.setAttribute('role', 'alert');
         }else{
            mainInboxContainer.className = 'p-3 mb-2 bg-warning text-dark';
            
         }

         //make mail clickable
         mainInboxContainer.style.cursor="pointer";
    

         //add to container element eventListener
         mainInboxContainer.addEventListener('click', () => viewEmail(element.id));


         //add archive button
         const archiveButton = document.createElement('button');
         archiveButton.classList.add("btn", "btn-secondary");
         archiveButton.innerHTML = 'Archive';
         mainInboxContainer.append(archiveButton);
         archiveButton.addEventListener('click', () => archive(element.id));

        })
        
        
        
      }
// do all the same for archive mailbox
      if(mailBox == 'archive'){
        sentMailbox.style.display = 'none';
        inboxMailbox.style.display = 'none';
        archiveMailbox.style.display = 'block';
        console.log(email);

        email.forEach(element => {

          const mainArchiveContainer = document.createElement('div');
          archiveMailbox.append(mainArchiveContainer);


          let inboxElementSentby = document.createElement('h5');
          inboxElementSentby.innerHTML = `From: ${element.sender}`;
          mainArchiveContainer.append(inboxElementSentby);

          let inboxElementRecipients = document.createElement('h5');
          inboxElementRecipients.innerHTML = `To: ${element.recipients}`;
          mainArchiveContainer.append(inboxElementRecipients);

          let inboxElementDate = document.createElement('h7');
          inboxElementDate.innerHTML = `Date: ${element.timestamp}`;
          mainArchiveContainer.append(inboxElementDate);

          let inboxElementSubject = document.createElement('p');
          inboxElementSubject.innerHTML = `Subject: ${element.subject}`;
          mainArchiveContainer.append(inboxElementSubject);

          if(element.read == true){
            mainArchiveContainer.className = 'alert alert-secondary';
            mainArchiveContainer.setAttribute('role', 'alert');
         }else{
          mainArchiveContainer.className = 'p-3 mb-2 bg-warning text-dark';
            
         }

         //make mail clickable
         mainArchiveContainer.style.cursor="pointer";
   

         //add to every element eventListener
         mainArchiveContainer.addEventListener('click', () => viewEmail(element.id));


         //add archive button
         const archiveButton = document.createElement('button');
         archiveButton.classList.add("btn", "btn-secondary");
         archiveButton.innerHTML = 'Unarchive';
         mainArchiveContainer.append(archiveButton);
         archiveButton.addEventListener('click', () => unArchive(element.id));

        })

      }
    })
   
  }

function viewEmail(emailID){

  document.querySelector('#viewEmail').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

    

  fetch(`emails/${emailID}`)
  .then(response => response.json())
  .then(email => {

    // add information to the html elements
    const emailSender = document.querySelector('#viewEmail-sender');
    emailSender.innerHTML = `Sent by: ${email.sender}`; 

    const emailRecipient = document.querySelector('#viewEmail-recipients');
    emailRecipient.innerHTML = `Recipients: ${email.recipients}`;
    
    const emailSubject = document.querySelector('#viewEmail-subject');
    emailSubject.innerHTML = `Subject: ${email.subject}`;

    const emailTimestamp = document.querySelector('#viewEmail-timestamp');
    emailTimestamp.innerHTML = `Date: ${email.timestamp}`;

    const emailBody = document.querySelector('#viewEmail-body');
    emailBody.classList.add("alert", "alert-info");
    emailBody.innerHTML = `Message: ${email.body}`;
// add event listener to reply button
document.querySelector('#replyButton').addEventListener('click', () => reply(email.id));
  })

//mark email as read
  fetch(`/emails/${emailID}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  
}
// marking email archived
function archive(elementID){
  fetch(`/emails/${elementID}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  .then(response => {
    if (response.ok) {
      load_mailbox('inbox');
    } else {
      console.error('Error archiving email:', response.statusText);
    }

  })  
  
}
// marking email Unarchived
function unArchive(elementID){
  fetch(`/emails/${elementID}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  .then(response => {
    if (response.ok) {
      load_mailbox('archive');
    } else {
      console.error('Error unarchiving email:', response.statusText);
    }

  })  
}

function reply(emailID){
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#viewEmail').style.display = 'none';
  
    // Clear out composition fields
    
    

    fetch(`/emails/${emailID}`)
    .then(response => response.json())
    .then(email => {
        // Print email
        console.log(email);
        document.querySelector('#compose-recipients').value = email.sender;
        if(email.subject.slice(0, 3).toLowerCase() != 're:'){
          document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        }else{
          document.querySelector('#compose-subject').value = email.subject;
        }
        document.querySelector('#compose-body').value = `On: ${email.timestamp}, ${email.sender} wrote: ${email.body}`;


        // ... do something else with email ...
    });
  
}
