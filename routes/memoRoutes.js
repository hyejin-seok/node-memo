const express = require("express");
const router = express.Router();
const memoController = require("../controllers/memoController");

// Route to add a memo
router.get("/add", (req, res) => {
  console.log("Reached GET /memos/add");
  res.render("memos/addMemo", { pageTitle: "Create Memo" });
});

// Route to fetch all memos
router.get("/", (req, res) => {
  const memos = memoController.getAllMemos();
  res.render("memos/memos", { memos, pageTitle: "Memos List" });
  //   res.json(memos);
});

// Route to fetch one memo
router.get("/:id", (req, res) => {
  const memoId = parseInt(req.params.id); // 여기서 id의 type은 string이라서 숫자로 변환 필요.
  const memo = memoController.getMemoById(memoId);
  if (!memo) {
    res.status(404).json({ error: "Memo not found" });
  } else {
    // res.status(200).json(memo);
    res.render("memos/memoDetails", { memo, pageTitle: "Memo Details" });
  }
});

router.post("/add", (req, res) => {
  console.log("Reached POST /memos/add");
  const { title, content } = req.body;
  const memo = memoController.createMemo(title, content);
  res.redirect("/memos");
});

// Route to edit memo (render the form)
router.get("/:id/edit", (req, res) => {
  const memoId = parseInt(req.params.id);
  const memo = memoController.getMemoById(memoId);
  if (!memo) {
    res.status(404).json({ error: "Memo not found" });
  } else {
    res.render("memos/editMemo", { memo, pageTitle: "Edit Memo" });
  }
});

// Route to handle form submission for editing memo
router.post("/:id/edit", (req, res) => {
  const memoId = parseInt(req.params.id);
  const { title, content } = req.body;
  const memo = memoController.updateMemo(memoId, title, content);
  if (!memo) {
    res.status(404).json({ error: "Memo not found" });
  } else {
    res.redirect("/memos");
  }
});

// Route to delete memo
router.delete("/:id", (req, res) => {
  const memoId = parseInt(req.params.id);
  const result = memoController.deleteMemo(memoId);
  if (result) {
    res.redirect("/memos");
  } else {
    res.status(404).json({ error: "Memo does not exist" });
  }
});

module.exports = router;
