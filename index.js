const index = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/styles.css" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
      crossorigin="anonymous"
    />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <title>Comment page</title>
  </head>
  <body>
    <!-- Using Contensis Delivery API & JavaScript. -->
    <div class="container my-3">
      <div class="row g-0 justify-content-center">
        <div class="col-lg-8">
          <h1 class="my-3">Leave a comment for the council</h1>
          <form
            enctype="multipart/form-data"
            action="/comments/leavecomment"
            method="POST"
          >
            <textarea
              class="p-1 w-100 comment-textarea"
              id="comment"
              name="comment"
              placeholder="Enter your comment."
              rows="3"
            ></textarea>
            <h2 class="fs-5 mt-3">Upload an image</h2>
            <div class="row">
              <div class="col-12 col-md-8">
                <input
                  type="file"
                  id="img_picker"
                  name="image"
                  accept=".png,.jpg,.jpeg"
                />
              </div>
              <div class="col-12 col-md-4 d-flex d-none" id="img-upload">
                <img
                  class="thumb2 img-fluid border border-secondary"
                  id="myImg"
                  src="/static/placeholder.png"
                />
              </div>
            </div>
            <button id="my-btn" class="btn mt-2 mb-3" >
              Submit
            </button>
          </form>

          <div class="d-none msg border p-2 mb-2 rounded">
            <p id="display-box" class="mb-0"><%= msg %></p>
          </div>
          <div id="tableDiv" class="container px-0 mt-3">
            <div class="table-responsive">
              <table id="myTable" class="table">
                <caption class="d-none">
                  Comments
                </caption>
                <thead>
                  <tr>
                    <th id="dateField" scope="col">Date</th>
                    <th id="commentField" scope="col">Comments received</th>
                    <th id="image" scope="col">Image</th>
                  </tr>
                </thead>
                <tbody><%- table %></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="/static/comment.js"></script>
  </body>
</html>
`;

export default index;
