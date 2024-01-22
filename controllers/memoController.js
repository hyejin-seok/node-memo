const { Memo } = require("../models/memoModel");

function getAllMemos() {
  return Memo.getAllMemos();
}

function getMemoById(id) {
  // Add logic here
  return Memo.getMemoById(id);
}

function createMemo(title, category, content) {
  return Memo.createMemo(title, category, content);
}

function updateMemo(id, title, category, content) {
  return Memo.updateMemo(id, title, category, content);
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
