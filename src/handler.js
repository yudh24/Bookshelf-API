const { nanoid } = require('nanoid');
const books = require('./books');

// Fungsi menambah Buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

  const newBook = {
    id,
    insertedAt,
    updatedAt,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
  };

  // error apabila nama kosong
  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // error apabila readpage lebih besar pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // push data book ke array books
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambah',
  });
  response.code(500);
  return response;
};

const getsAllBooks = (request, h) => {
  const { reading, finished, name } = request.query;

  // Get All reading book
  if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: (
          books.filter((book) => book.reading === true).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }))
        ),
      },
    });
    response.code(200);
    return response;
  }

  // Get All unread book
  if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: (
          books.filter((book) => book.reading === true).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }))
        ),
      },
    });
    response.code(200);
    return response;
  }

  // Get All finished Book
  if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: (
          books.filter((book) => book.finished === true).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }))
        ),
      },
    });
    response.code(200);
    return response;
  }

  // Get All unfinished book
  if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: (
          books.filter((book) => book.finished === false).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }))
        ),
      },
    });
    response.code(200);
    return response;
  }

  if (name !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: (
          books.filter((book) => book.name.toLowerCase()
            .includes(name.toLowerCase())).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }))
        ),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: (
        books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }))
      ),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return ({
      status: 'success',
      data: {
        book,
      },
    });
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookById = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name == null) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getsAllBooks,
  getBookByIdHandler,
  editBookById,
  deleteBookById,
};
