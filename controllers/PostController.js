import Post from '../models/Post.js'

export const getLastTags = async (req, res) => {
  try {
    const posts = await Post.find().limit(5).exec();

    const tags = posts.map((obj) => obj.tags).flat().slice(0, 5);
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get posts'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findByIdAndUpdate(
    {
      _id: postId,
    }, {
      $inc: { viewsCount: 1 }
    }, {
      returnDocument: 'after',
    }, 
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Cannot get this post'
        })  
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Cannot find this post'
        })
      }
      res.json(doc);
    }
    )

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get post'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findByIdAndDelete({
      _id: postId,
    }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Cannot delete this post'
        })  
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Cannot find this post'
        })
      }
      res.json({
        success: 'deleted',
      });
    })
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot delete post'
    })
  }
}
export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get posts'
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cant create post',
    });
  }
};

// export const update = async (res, req) => {
//   try {
//     const postId = req.params.id;
//     await Post.updateOne(
//     {
//       _id: postId
//     }, {
//       title: req.body.title,
//       text: req.body.text,
//       imageUrl: req.body.imageUrl,
//       tags: req.body.tags,
//       user: req.userId,  
//   },
//   );
//   res.json({
//     success: 'updated',
//   })
// } catch (err) {
//   console.log(err);
//   res.status(500).json({
//     message: 'Cant update post',
//   });
// }
// }
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await Post.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cant update post',
    });
  }
};

