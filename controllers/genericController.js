const genericCrud = (Model) => {
  return {
    // create new
    create: async (req, res) => {
      try {
        const doc = await Model.create({
          ...req.body,
          createdBy: req.user._id, // auto gán người tạo là user đang đăng nhập
        });
        res.status(201).json(doc);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Lỗi tạo dữ liệu", error: error.message });
      }
    },

    // lấy tất cả dữ liệu (đối với user đang đăng nhập)
    getAll: async (req, res) => {
      try {
        const docs = await Model.find({ createdBy: req.user._id });
        res.status(200).json(docs);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Lỗi lấy dữ liệu", error: error.message });
      }
    },

    // lấy 1 bản ghi theo ID
    getOne: async (req, res) => {
      try {
        const doc = await Model.findOne({
          _id: req.params.id,
          createdBy: req.user._id,
        });
        if (!doc)
          return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
        res.status(200).json(doc);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Lỗi lấy dữ liệu", error: error.message });
      }
    },

    // update
    update: async (req, res) => {
      try {
        const doc = await Model.findOneAndUpdate(
          { _id: req.params.id, createdBy: req.user._id },
          req.body,
          { new: true },
        );
        if (!doc)
          return res
            .status(404)
            .json({ message: "Không tìm thấy dữ liệu để cập nhật" });
        res.status(200).json(doc);
      } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
      }
    },

    // baibai
    delete: async (req, res) => {
      try {
        const doc = await Model.findOne({
          _id: req.params.id,
          createdBy: req.user._id,
        });
        if (!doc)
          return res
            .status(404)
            .json({ message: "Không tìm thấy dữ liệu để xóa" });

        await doc.delete();
        res.status(200).json({ message: "Đã xóa thành công" });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Lỗi xóa dữ liệu", error: error.message });
      }
    },
  };
};

module.exports = genericCrud;
