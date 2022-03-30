const router = require("express").Router();
const {
  signUpMemberMethod,
  signInMemberMethod,
  signUpAdminMethod,
  signInAdminMethod,
  firstInputMethod,
  getOneMemberMethod,
  getAllMemberMethod,
  postArticleMethod,
  getAllArticleMethod,
  viewArticleMethod,
  viewArticleOnceMethod,
  getArticleSeenMethode,
  getAllLatihanMethode,
  postLatihanMethode,
  viewLatihanOnceMethod,
  getLatihanSeenMethode,
  getAllTest,
  getAllScore,
  getPostScore,
} = require("./account.method");

router.post("/signUpMember", signUpMemberMethod);
router.post("/signInMember", signInMemberMethod);

router.post("/firstInput", firstInputMethod);

router.post("/signUpAdmin", signUpAdminMethod);
router.post("/signInAdmin", signInAdminMethod);

router.post("/member/getOne", getOneMemberMethod);
router.get("/member/getAll", getAllMemberMethod);

router.post("/article/post", postArticleMethod);
router.get("/article/getAll", getAllArticleMethod);
router.post("/article/view", viewArticleMethod);
router.post("/article/viewOnce", viewArticleOnceMethod);
router.post("/article/seen", getArticleSeenMethode);

router.get("/latihan/getAll", getAllLatihanMethode);
router.post("/latihan/post", postLatihanMethode);
router.post("/latihan/viewOnce", viewLatihanOnceMethod);
router.post("/latihan/seen", getLatihanSeenMethode);

router.get("/test/getAll", getAllTest);

router.post("/score/getAll", getAllScore);

router.post("/score/post", getPostScore);

module.exports = router;
