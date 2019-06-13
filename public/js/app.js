

let idNote;
const SaveArticle = [];
function rendersComment(notes){
    if(notes && notes.length !== 0){
        const commentList=  notes.map(function(elt){
            return(`
            
                <div class="row noteElt">
                    <div class="col-10 col-md-11"><span class="badge badge-pill badge-primary">${elt.author}  </span> ${elt.comment} </div>
                    <div class="col-2 col-md-1"><button class="btn btn-danger deleteNote" data-noteId= ${elt._id}> X </button></div> 
                </div>`)
        })
    
        return commentList.join(' ');
    }else{
        return "";
    }
}

function rendersToDom(datas, whatToDo){
    
    const DomArticle =  datas.map(function(data){
        let btndata = "";
        let commentDom = "";
        if(whatToDo === "article"){
            btndata = `<button type="button" class="btn btn-danger btn-block m-1 p-1 save save${data._id}" data-id=${data._id}> save</button>`;
        }else{
            btndata = `<button type="button" class="btn  btn-block m-1 p-1 deleteArticle" data-id=${data._id}> Delete Article</button>
                        <button type="button" class="btn btn-info btn-block m-1 p-1 addNote" data-id=${data._id}> add Note</button>`;
            commentDom = `<div class="comment">${rendersComment(data.notes)}</div>`;
        }
    
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
                ${btndata}
            </div>
            ${commentDom}
          </div>  
      </div>`);
      });

      $(".listNews").html(DomArticle);
}
$(document).ready(function(){
    //<button type="button" class="btn btn-danger btn-block m-1 p-1 addNote" data-id=${data._id}> add Note</button>
    //<div class="comment">${rendersComment(data.notes)}</div>
    $.get("/articles", function(dataArticles){
        $(".TextHeader").text("HeadLight News from Cnet");
        rendersToDom(dataArticles, "article");
    })

    $(".listNews").on("click", ".addNote", function(event){
        idNote = $(this).attr("data-id")
        $("#NotesModal").modal("show");
    })
    

   $("#scrape").click(function(event){
    $.get("/scrape", function(data){
        window.location.href= "/";
    })
   })
    $(".postComment").click(function(event){
        event.preventDefault();
        const author = $("#username").val();
        const comment = $("#comment").val();
        const newComment = {
            author: author,
            comment: comment
        }

        $.post("/notes/comments/"+idNote, newComment, function(response){
            $("#NotesModal").modal("hide");
            const artObj = {
                saveArt : SaveArticle
            }
           $.post('/saveArticle', artObj, function(articleSaveData){
               console.log("display save article!!!!");
               console.log(articleSaveData);
               rendersToDom(articleSaveData, "saveArticle");
           })
        } )
        
    })

    $(".listNews").on("click", ".save", function(event){
        const data_id = $(this).attr("data-id");
        SaveArticle.push(data_id);
        $(".save"+data_id).addClass("disabled");
        console.log("SaveArticle", SaveArticle);
    })

    $("#saveArticle").click(function(event){
        const artObj = {
            saveArt : SaveArticle
        }
       $.post('/saveArticle', artObj, function(articleSaveData){
        $(".TextHeader").text(" Saved headLight News from Cnet");
        if(SaveArticle.length === 0){
            $(".listNews").html(`
            <div class="card">
                <div class="card-body">
                    <h3>You having save any news yet</h3>
                    <a  href="/" class="btn btn-primary btn-lg" >Go back to Home</a>
                </div>
            </div>`)
        }else{
           rendersToDom(articleSaveData, "saveArticle");
        }
       })
    })

    $(".listNews").on("click", ".deleteNote", function(event){
        const noteId = $(this).attr('data-noteId');
        console.log(noteId);
        
        const url = "/note/delete/"+noteId;
        console.log("url", url);
        axios.get(url).then(function(){
            if(SaveArticle.length === 0){
                $(".listNews").html(`
                <div class="card">
                    <div class="card-body">
                        <h3>You have not saved any news Article yet. </h3>
                        <p>Go back to the home page and click Save to keep the items you want backed up in your daily journal</p>
                        <a  href="/" class="btn btn-primary btn-lg" >Go back to Home</a>
                    </div>
                </div>`)
            }else{
                const artObj = {
                    saveArt : SaveArticle
                }
               $.post('/saveArticle', artObj, function(articleSaveData){
                   console.log("display save article!!!!");
                   console.log(articleSaveData);
                   rendersToDom(articleSaveData, "saveArticle");
               })
            }
            
        })


    })
})