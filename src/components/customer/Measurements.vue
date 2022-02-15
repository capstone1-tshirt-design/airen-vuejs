<template>
  <div class="container">
    <div>
      <br /><br /><br /><br /><br /><br /><br /><br />
      <form
        name="qryform"
        id="qryform"
        method="post"
        onsubmit="return(validate());"
        novalidate="novalidate"
      >
        <div class="form-group">
          <label>Collar</label>
          <input
            type="textarea"
            class="form-control"
            id="name"
            placeholder="cm"
            style="text-align: center"
            name="name"
          />
          <label>Neck</label>
          <input
            type="email"
            class="form-control"
            id="name"
            placeholder="cm"
            style="text-align: center"
            name="email"
          />
          <label>Sleeve</label>
          <input
            type="text"
            class="form-control"
            id="phone"
            placeholder="cm"
            style="text-align: center"
            name="phone"
          />
          <label>Waist</label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="cm"
            style="text-align: center"
            name="subject"
          />
          <label>Hip</label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="cm"
            style="text-align: center"
            name="subject"
          />
          <label>Cuff</label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="cm"
            style="text-align: center"
            name="subject"
          />
          <br />
          <div class="btn-group">
            <button type="submit" value="submit" style="text-align: center">
              Submit
            </button>
            <button>Show me How</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<style lang="scss">
.form-group {
  // width: 400px;
  // background: #ccc;
  // padding: 15px;
  // width: 400px;z
  // background: #f8f9fa;
  // padding: 15px;
  box-shadow: 0 0 4px #ccc;
  margin: auto;
  text-align: start;
  border-radius: 10px;
  background-color: #f2f2f2;
  padding: 20px;
  width: 50%;
}
.btn-group button {
  background-color: #2acaea;
  border: 1px solid black;
  color: white;
  padding: 10px 24px;
  cursor: pointer;
  float: center;
  text-align: center;
  margin: auto;
}
.btn-group:after {
  content: '';
  clear: both;
  display: table;
}
.btn-group button:not(:last-child) {
  border-right: none;
}
.btn-group button:hover {
  background-color: #ffb6c1;
}
</style>
