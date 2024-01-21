class Memo {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  // Get all memos
  static getAllMemos() {
    return memos;
  }

  // Get memo by id
  static getMemoById(id) {
    return memos.find((memo) => memo.id === id);
  }

  // Create a memo
  static createMemo(title, content) {
    const memoId = memos.length + 1;
    const memo = new Memo(memoId, title, content);
    memos.push(memo);
    return memo;
  }

  // Update a memo
  static updateMemo(id, title, content) {
    const memo = memos.find((item) => item.id === id);
    if (memo) {
      memo.title = title;
      memo.content = content;
    }
    return memo;
  }

  // Delete a memo
  static deleteMemo(id) {
    const index = memos.findIndex((memo) => memo.id === id);
    if (index !== -1) {
      memos.splice(index, 1);
      return true;
    }
    return false;
  }
}

const memos = [];

module.exports = {
  Memo,
  memos,
};
