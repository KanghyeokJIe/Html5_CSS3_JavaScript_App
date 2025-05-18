// 전역 상수
const API_BASE_URL = "http://localhost:8080/api/books";
let editingBookId = null;

// DOM 요소
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");
const cancelButton = bookForm.querySelector(".cancel-btn");
const submitButton = bookForm.querySelector('button[type="submit"]');
const formError = document.getElementById("formError");

// 페이지 로드 시 도서 목록 불러오기
document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
});

// 도서 목록 조회
function loadBooks() {
    fetch(API_BASE_URL)
        .then(response => {
            if (!response.ok) throw new Error("도서 목록을 불러오지 못했습니다.");
            return response.json();
        })
        .then(books => renderBookTable(books))
        .catch(error => {
            showError(error.message);
            bookTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#dc3545;">
                        오류: 데이터를 불러올 수 없습니다.
                    </td>
                </tr>`;
        });
}

// 도서 목록 렌더링
function renderBookTable(books) {
    bookTableBody.innerHTML = "";
    books.forEach(book => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.price}</td>
            <td>${book.publishDate}</td>
            <td>
                <button class="edit-btn" onclick="editBook(${book.id})">수정</button>
                <button class="delete-btn" onclick="deleteBook(${book.id})">삭제</button>
            </td>
        `;
        bookTableBody.appendChild(row);
    });
}

// 도서 등록 or 수정 제출
bookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(bookForm);
    const bookData = {
        title: formData.get("title").trim(),
        author: formData.get("author").trim(),
        isbn: formData.get("isbn").trim(),
        price: parseInt(formData.get("price"), 10),
        publishDate: formData.get("publishDate")
    };

    if (!validateBook(bookData)) return;

    if (editingBookId) {
        updateBook(editingBookId, bookData);
    } else {
        createBook(bookData);
    }
});

// 도서 유효성 검사
function validateBook(book) {
    if (!book.title) return alert("제목을 입력해주세요."), false;
    if (!book.author) return alert("저자를 입력해주세요."), false;
    if (!book.isbn) return alert("ISBN을 입력해주세요."), false;
    if (!book.price || isNaN(book.price)) return alert("가격을 숫자로 입력해주세요."), false;
    if (!book.publishDate) return alert("출판일을 선택해주세요."), false;
    return true;
}

// 도서 등록 (POST)
function createBook(bookData) {
    fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "도서 등록에 실패했습니다.");
        }
        return response.json();
    })
    .then(() => {
        showSuccess("도서가 성공적으로 등록되었습니다!");
        resetForm();
        loadBooks();
    })
    .catch(error => showError(error.message));
}

// 도서 수정용 데이터 불러오기 (GET by ID)
function editBook(bookId) {
    fetch(`${API_BASE_URL}/${bookId}`)
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "도서를 찾을 수 없습니다.");
            }
            return response.json();
        })
        .then(book => {
            bookForm.title.value = book.title;
            bookForm.author.value = book.author;
            bookForm.isbn.value = book.isbn;
            bookForm.price.value = book.price;
            bookForm.publishDate.value = book.publishDate;

            editingBookId = bookId;
            submitButton.textContent = "도서 수정";
            cancelButton.style.display = "inline-block";
        })
        .catch(error => showError(error.message));
}

// 도서 수정 요청 (PUT)
function updateBook(bookId, bookData) {
    fetch(`${API_BASE_URL}/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "도서 수정에 실패했습니다.");
        }
        return response.json();
    })
    .then(() => {
        showSuccess("도서가 성공적으로 수정되었습니다!");
        resetForm();
        loadBooks();
    })
    .catch(error => showError(error.message));
}

// 도서 삭제 요청 (DELETE)
function deleteBook(bookId) {
    if (!confirm(`ID ${bookId} 도서를 정말 삭제하시겠습니까?`)) return;

    fetch(`${API_BASE_URL}/${bookId}`, {
        method: "DELETE"
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "도서 삭제에 실패했습니다.");
        }
        showSuccess("도서가 성공적으로 삭제되었습니다!");
        loadBooks();
    })
    .catch(error => showError(error.message));
}

// 폼 초기화
function resetForm() {
    bookForm.reset();
    editingBookId = null;
    submitButton.textContent = "도서 등록";
    cancelButton.style.display = "none";
    clearMessages();
}

// 메시지 출력 함수
function showSuccess(message) {
    formError.textContent = message;
    formError.style.display = "block";
    formError.style.color = "#28a745";
}

function showError(message) {
    formError.textContent = message;
    formError.style.display = "block";
    formError.style.color = "#dc3545";
}

function clearMessages() {
    formError.style.display = "none";
}
