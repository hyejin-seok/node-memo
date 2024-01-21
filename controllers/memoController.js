const { Memo } = require("../models/memoModel");

function getAllMemos() {
  return Memo.getAllMemos();
}

function getMemoById(id) {
  // Add logic here
  return Memo.getMemoById(id);
}

function createMemo(title, content) {
  return Memo.createMemo(title, content);
}

function updateMemo(id, title, content) {
  return Memo.updateMemo(id, title, content);
}

function deleteMemo(id) {
  return Memo.deleteMemo(id);
}

module.exports = {
  getAllMemos,
  getMemoById,
  createMemo,
  updateMemo,
  deleteMemo,
};
