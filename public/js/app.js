let idNote;
$(document).ready(function(){
    $.get("/articles", function(dataArticles){
      const DomArticle =  dataArticles.map(function(data){
         return (`
         <div class="card bg-primary text-white p-1 m-2">
            <div class="card-body">
                <div class="leftElt news">
                    <a href=${data.link}>
                        <img src=${data.img} class="img-thumbnail" alt="Image news">
                    </a>
                </div>
                <div class="centerElt news">
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                </div>
                <div class="rightElt news">
                    <button type="button" class="btn btn-danger btn-block m-1 p-1 save" data-id=${data._id}> save</button>
                    <button type="button" class="btn btn-danger btn-block m-1 p-1 addNote" data-id=${data._id}> add Note</button>
                </div>
            </div>
            <div class="comment"></div>
        </div>`);
        });

        $(".listNews").html(DomArticle);
    })

    $(".listNews").on("click", ".addNote", function(event){
        idNote = $(this).attr("data-id")
        $("#NotesModal").modal("show");
    })

    $(".postComment").click(function(event){
        event.preventDefault();
        const author = $("#username").val();
        const comment = $("#comment").val();
        console.log(user, comment, idNote);
        const newComment = {
            author: author,
            comment: comment
        }

        $.post("/notes/comments", newComment, function(response){
            console.log(response);
        } )
    })

})