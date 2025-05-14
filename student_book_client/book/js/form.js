// 전역변수
const API_BASE_URL = "http://localhost:8080";

// DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

// Document Load 이벤트 처리
document.addEventListener("DOMContentLoaded", function () {
  loadBooks();
});

// Form Submit 이벤트 처리
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("도서 등록 폼 제출됨...");

  const formData = new FormData(bookForm);

  const bookData = {
    title: formData.get("title").trim(),
    author: formData.get("author").trim(),
    isbn: formData.get("isbn").trim(),
    price: Number(formData.get("price")),
    publishDate: formData.get("publishDate"),
  };

  if (!validateBook(bookData)) {
    return;
  }

  console.log("유효한 도서 데이터:", bookData);

  // TODO: 서버에 전송 또는 테이블에 추가 (추후 구현 가능)
});

// 데이터 유효성 검사 함수
function validateBook(book) {
  if (!book.title) {
    alert("제목을 입력해주세요.");
    return false;
  }

  if (!book.author) {
    alert("저자를 입력해주세요.");
    return false;
  }

  if (!book.isbn) {
    alert("ISBN을 입력해주세요.");
    return false;
  }

  // ISBN 형식 검사: 숫자 또는 하이픈 포함 허용
  const isbnPattern = /^[0-9\-]+$/;
  if (!isbnPattern.test(book.isbn)) {
    alert("올바른 ISBN 형식이 아닙니다. 숫자와 '-'만 허용됩니다.");
    return false;
  }

  // 가격 유효성 검사
  if (isNaN(book.price) || book.price <= 0) {
    alert("가격은 0보다 큰 숫자여야 합니다.");
    return false;
  }

  // 출간일 유효성 검사 (빈 값 또는 미래일자 방지 등 추가 가능)
  if (!book.publishDate) {
    alert("출간일을 입력해주세요.");
    return false;
  }

  return true;
}

// 도서 목록 로딩 함수
function loadBooks() {
  console.log("도서 목록 로딩 중...");
}