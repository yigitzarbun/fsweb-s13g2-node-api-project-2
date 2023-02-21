// post routerları buraya yazın
const express = require("express");
const router = express.Router();
const posts = require("./posts-model");

router.get("/", (req, res) => {
  posts
    .find()
    .then((postsList) => {
      res.status(200).json(postsList);
    })
    .catch((err) => res.status(500).json({ message: "Gönderiler alınamadı" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  posts
    .findById(id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      }
    })
    .catch((err) =>
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" })
    );
});

router.post("/", (req, res) => {
  const newPost = {
    title: req.body.title,
    contents: req.body.contents,
  };

  if (newPost.title && newPost.contents) {
    posts
      .insert(newPost)
      .then(({ id }) => {
        posts
          .findById(id)
          .then((foundPost) => {
            res.status(201).json(foundPost);
          })
          .catch((err) =>
            res
              .status(500)
              .json({ message: "Veritabanına kaydedilirken bir hata oluştu" })
          );
      })
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Veritabanına kaydedilirken bir hata oluştu" })
      );
  } else {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const idAvailable = await posts.findById(id);
  const newPost = {
    title: req.body.title,
    contents: req.body.contents,
  };
  if (idAvailable) {
    if (newPost.title && newPost.contents) {
      try {
        await posts.update(id, newPost);
        let updatedPost = await posts.findById(id);
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
      }
    } else {
      res.status(400).json({
        message: "Lütfen gönderi için title ve contents sağlayın",
      });
    }
  } else {
    res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const idAvailable = await posts.findById(id);
  if (idAvailable) {
    posts
      .remove(id)
      .then((deletedPost) => res.status(200).json(idAvailable))
      .catch((err) => res.status(500).json({ message: "Gönderi silinemedi" }));
  } else {
    res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
  }
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const idAvailable = await posts.findById(id);
  if (idAvailable) {
    posts
      .findPostComments(id)
      .then((comments) =>
        res
          .status(200)
          .json(
            comments.length > 0
              ? comments
              : { message: "Bu post için henüz yapılan yorum yoktur." }
          )
      )
      .catch((err) =>
        res.status(500).json({ message: "Yorumlar bilgisi getirilemedi." })
      );
  } else {
    res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
  }
});

module.exports = router;
