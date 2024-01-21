const express = require("express");
const router = express.Router();
const memoController = require("../controllers/memoController");

// Route to fetch all memos
router.get("/", (req, res) => {
  const memos = memoController.getAllMemos();
  res.render("memos", { memos, pageTitle: "Memos List" });
  //   res.json(memos);
});

// Route to fetch one memo
router.get("/:id", (req, res) => {
  const memoId = parseInt(req.params.id); // 여기서 id의 type은 string이라서 숫자로 변환 필요.
  const memo = memoController.getMemoById(memoId);
  if (!memo) {
    res.status(404).json({ error: "No memo exist" });
  } else {
    res.status(200).json(memo);
  }
});

// Route to add a memo
router.post("/", (req, res) => {
  const { title, content } = req.body; // req body is from POST request body
  const memo = memoController.createMemo(title, content);
  res.status(201).json(memo); // status code for creating, adding is 201 (status code is optional)
});
// Route to update memo
router.put("/:id", (req, res) => {
  const memoId = parseInt(req.params.id);
  const { title, content } = req.body;
  const memo = memoController.updateMemo(memoId, title, content);
  if (!memo) {
    res.status(404).json({ error: "memo does not exist" });
  } else {
    res.status(200).json(memo);
  }
});

// Route to delete memo
router.delete("/:id", (req, res) => {
  const memoId = parseInt(req.params.id);
  const result = memoController.deleteMemo(memoId);
  if (result) {
    res.status(200).json({ message: "Memo deleted!" });
  } else {
    res.status(404).json({ error: "Memo does not exist" });
  }
});

module.exports = router;
