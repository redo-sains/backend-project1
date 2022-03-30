const bcrypt = require("bcrypt");
const {
  setDoc,
  getDocs,
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  Timestamp,
} = require("firebase/firestore");
const { db } = require("../firebase.config");

const signUpMemberMethod = async (req, res) => {
  const { noHp, password } = req.body;

  try {
    const docUser = doc(db, "Users", "Accounts", "Member", noHp);
    const docSnap = await getDoc(docUser);

    if (!docSnap.exists()) {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hashPass = await bcrypt.hash(password, salt);
      const docRef = await setDoc(docUser, {
        noHp,
        password: hashPass,
      });

      res.status(200).send({ success: true });
    } else {
      res.status(200).send({ success: false });
    }
  } catch (error) {
    console.error("error add document", error);
  }
};

const signInMemberMethod = async (req, res) => {
  const { noHp, password } = req.body;

  try {
    const docRef = doc(db, "Users", "Accounts", "Member", noHp);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const akunPass = docSnap.data().password;
      const access = await bcrypt.compare(password, akunPass);
      res.send(access);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log(error);
  }
};

const signInAdminMethod = async (req, res) => {
  const { noHp, password } = req.body;

  try {
    const docRef = doc(db, "Users", "Accounts", "Admin", noHp);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const akunPass = docSnap.data().password;
      const access = await bcrypt.compare(password, akunPass);
      res.send(access);
    } else {
      res.send(false);
    }
  } catch (error) {}
};

const signUpAdminMethod = async (req, res) => {
  const { noHp, password } = req.body;

  try {
    const docUser = doc(db, "Users", "Accounts", "Admin", noHp);
    const docSnap = await getDoc(docUser);

    if (!docSnap.exists()) {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hashPass = await bcrypt.hash(password, salt);
      const docRef = await setDoc(docUser, {
        noHp,
        password: hashPass,
      });

      res.status(200).send({ message: "akun sukses dibuat" });
    } else {
      res.status(400).send({ message: "akun sudah ada" });
    }
  } catch (error) {
    console.error("error add document", error);
  }
};

const firstInputMethod = async (req, res) => {
  const {
    nama,
    HPHT,
    noHp,
    umur,
    agama,
    pendidikan,
    pekerjaan,
    riwayatPenyakit,
  } = req.body;
  const { year, month, day } = HPHT;
  const date = new Date(parseInt(year), parseInt(month), parseInt(day));

  try {
    const docUser = doc(db, "Users", "Accounts", "Member", noHp);
    const docSnap = await getDoc(docUser);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const docRef = await updateDoc(docUser, {
        nama,
        HPHT: Timestamp.fromDate(date),
        umur,
        agama,
        pendidikan,
        pekerjaan,
        riwayatPenyakit,
      });

      res.status(200).send({ success: true });
    } else {
      res.status(200).send({ success: false });
    }
  } catch (error) {
    console.error("error add document", error);
  }
};

const getOneMemberMethod = async (req, res) => {
  const { noHp } = req.body;
  // res.send({ test: "success" });
  try {
    const docUser = doc(db, "Users", "Accounts", "Member", noHp);
    const docSnap = await getDoc(docUser);

    if (docSnap.exists()) {
      const docRef = docSnap.data();
      const data = {
        ...docRef,
        HPHT: docRef.HPHT == undefined ? docRef.HPHT : docRef.HPHT.toDate(),
      };

      res.status(200).send({ status: true, data });
    } else {
      res.status(200).send({ message: "account don't exist" });
    }
  } catch (error) {
    console.error("message : ", error);
  }
};

const getAllMemberMethod = async (req, res) => {
  try {
    const docUser = await getDocs(
      collection(db, "Users", "Accounts", "Member")
    );
    const list = docUser.docs.map((doc) => doc.data());

    const data = list.filter((e) => e.role == "member");

    const newList = data.map((data) => ({
      ...data,
      HPHT: data.HPHT.toDate(),
    }));

    res.status(200).send({ data: newList });
  } catch (error) {
    console.error("message : ", error);
  }
};

const postArticleMethod = async (req, res) => {
  const { title, tag, image, writer, brand, isi } = req.body;

  try {
    const docArticle = doc(db, "Article", title);
    const docSnap = await getDoc(docArticle);

    if (!docSnap.exists()) {
      const docRef = await setDoc(docArticle, {
        title,
        tag,
        image,
        writer,
        brand,
        isi,
        view: 0,
        createdAt: Timestamp.now(),
      });

      res.status(200).send({ message: "article sukses dibuat" });
    } else {
      res.status(400).send({ message: "article sudah ada" });
    }
  } catch (error) {
    console.error("error add document", error);
  }
};

const getAllArticleMethod = async (req, res) => {
  try {
    const docArticle = await getDocs(collection(db, "Article"));
    const list = docArticle.docs.map((doc) => doc.data());

    const newList = list.map((list) => {
      return {
        ...list,
        createdAt: list.createdAt.toDate(),
      };
    });

    res.status(200).send({ data: newList });
  } catch (error) {
    console.error("message : ", error);
  }
};

const viewArticleMethod = async (req, res) => {
  try {
    const { title } = req.body;
    // console.log(title);
    const docArticle = doc(db, "Article", title);
    const getArticle = await getDoc(docArticle);
    const articleView = (await getArticle.data().view) + 1;

    const setArticle = await updateDoc(docArticle, {
      view: articleView,
    });

    res.status(200).send({ status: articleView });
  } catch (error) {
    console.log(error);
  }
};

const viewArticleOnceMethod = async (req, res) => {
  try {
    const { title, noHp } = req.body;

    const docArticle = doc(db, "Users", "Accounts", "Member", noHp);
    const docRead = doc(
      db,
      "Users",
      "Accounts",
      "Member",
      noHp,
      "articleBaca",
      title
    );
    const getArticle = await getDoc(docRead);

    if (!getArticle.data()) {
      const getMakeBaca = setDoc(docRead, {
        title,
        read: true,
      });
    }

    res.status(200).send({ status: getArticle.data() });
  } catch (error) {
    console.log(error);
  }
};

const getArticleSeenMethode = async (req, res) => {
  try {
    const { noHp } = req.body;
    const collectionSeenArticle = collection(
      db,
      "Users",
      "Accounts",
      "Member",
      noHp,
      "articleBaca"
    );

    const docArticle = await getDocs(collectionSeenArticle);
    const list = docArticle.docs.map((doc) => doc.data());

    res.status(200).send(list);
  } catch (error) {
    console.log(error);
  }
};

const viewLatihanOnceMethod = async (req, res) => {
  try {
    const { title, noHp } = req.body;

    const docArticle = doc(db, "Users", "Accounts", "Member", noHp);
    const docRead = doc(
      db,
      "Users",
      "Accounts",
      "Member",
      noHp,
      "latihanBaca",
      title
    );

    const getArticle = await getDoc(docRead);

    if (!getArticle.data()) {
      const getMakeBaca = setDoc(docRead, {
        title,
        read: true,
      });
    }

    res.status(200).send({ status: getArticle.data() });
  } catch (error) {
    console.log(error);
  }
};

const getLatihanSeenMethode = async (req, res) => {
  try {
    const { noHp } = req.body;
    const collectionSeenArticle = collection(
      db,
      "Users",
      "Accounts",
      "Member",
      noHp,
      "latihanBaca"
    );

    const docArticle = await getDocs(collectionSeenArticle);
    const list = docArticle.docs.map((doc) => doc.data());

    res.status(200).send(list);
  } catch (error) {
    console.log(error);
  }
};

const getAllLatihanMethode = async (req, res) => {
  try {
    const hypnobrithingCollection = collection(
      db,
      "Latihan",
      "hypnobrithing",
      "menu"
    );
    const pranatalYogaCollection = collection(
      db,
      "Latihan",
      "pranatalYoga",
      "menu"
    );

    const docsPranatalYoga = await getDocs(pranatalYogaCollection);
    const docsHypnobrithing = await getDocs(hypnobrithingCollection);
    const pranatalYoga = docsPranatalYoga.docs.map((doc) => doc.data());
    const hypnobrithing = docsHypnobrithing.docs.map((doc) => doc.data());

    res.status(200).send({
      pranatalYoga,
      hypnobrithing,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllTest = async (req, res) => {
  try {
    const kontrolCollection = collection(db, "Test", "Kontrol Diri", "Menu");
    const efikasiCollection = collection(db, "Test", "Efikasi Diri", "Menu");
    const completeCollection = collection(db, "Test", "Complete Test", "Menu");

    const docsKontrol = await getDocs(kontrolCollection);
    const docsEfikasi = await getDocs(efikasiCollection);
    const docsComplete = await getDocs(completeCollection);

    const kontrol = docsKontrol.docs.map((doc) => doc.data());
    const efikasi = docsEfikasi.docs.map((doc) => doc.data());
    const complete = docsComplete.docs.map((doc) => doc.data());

    res.status(200).send({
      kontrol,
      efikasi,
      complete,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllScore = async (req, res) => {
  try {
    const { noHp } = req.body;

    const scoreCollection = collection(
      db,
      "Users",
      "Accounts",
      "Member",
      noHp,
      "Score"
    );

    const docsScore = await getDocs(scoreCollection);
    const score = docsScore.docs.map((doc) => doc.data());

    const first = score.find((data) => data.index == "first");
    const latest = score.find((data) => data.index == "latest");
    const complete = score.find((data) => data.index == "complete");

    res.status(200).send({
      score: {
        first,
        latest,
        complete,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getPostScore = async (req, res) => {
  try {
    const { noHp, score, condition } = req.body;

    switch (condition) {
      case "first kontrol": {
        console.log("running");
        const scoreDoc = doc(
          db,
          "Users",
          "Accounts",
          "Member",
          noHp,
          "Score",
          "firstTest"
        );

        const getScore = await getDoc(scoreDoc);
        const first = getScore.data();

        const setScore = setDoc(scoreDoc, {
          ...first,
          kontrol: score,
        });
        break;
      }
      case "first efikasi": {
        const scoreDoc = doc(
          db,
          "Users",
          "Accounts",
          "Member",
          noHp,
          "Score",
          "firstTest"
        );

        const getScore = await getDoc(scoreDoc);
        const first = getScore.data();

        const setScore = setDoc(scoreDoc, {
          ...first,
          efikasi: score,
        });
        break;
      }
      case "latest kontrol": {
        const scoreDoc = doc(
          db,
          "Users",
          "Accounts",
          "Member",
          noHp,
          "Score",
          "latestTest"
        );

        const getScore = await getDoc(scoreDoc);
        const first = getScore.data();

        const setScore = setDoc(scoreDoc, {
          ...first,
          kontrol: score,
        });
        break;
      }
      case "latest efikasi": {
        const scoreDoc = doc(
          db,
          "Users",
          "Accounts",
          "Member",
          noHp,
          "Score",
          "latestTest"
        );

        const getScore = await getDoc(scoreDoc);
        const first = getScore.data();

        const setScore = setDoc(scoreDoc, {
          ...first,
          efikasi: score,
        });
        break;
      }
      case "complete test": {
        const scoreDoc = doc(
          db,
          "Users",
          "Accounts",
          "Member",
          noHp,
          "Score",
          "completeTest"
        );

        const getScore = await getDoc(scoreDoc);
        const first = getScore.data();

        const setScore = setDoc(scoreDoc, {
          ...first,
          score,
        });
        break;
      }
    }

    const scoreCollection = collection(
      db,
      "Users",
      "Accounts",
      "Member",
      noHp,
      "Score"
    );

    const docsScore = await getDocs(scoreCollection);
    const scores = docsScore.docs.map((doc) => doc.data());

    const first = scores.find((data) => data.index == "first");
    const latest = scores.find((data) => data.index == "latest");
    const complete = scores.find((data) => data.index == "complete");

    res.status(200).send({
      score: {
        first,
        latest,
        complete,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const postLatihanMethode = async (req, res) => {
  const { latihan, title, tag, image, writer, brand, isi } = req.body;

  try {
    const docArticle = doc(db, "Latihan", latihan, "menu", title);
    const docSnap = await getDoc(docArticle);

    if (!docSnap.exists()) {
      const docRef = await setDoc(docArticle, {
        article: true,
        index: title,
        tag,
        image,
        writer,
        brand,
        isi,
        createdAt: Timestamp.now(),
      });

      res.status(200).send({ message: "latihan sukses dibuat" });
    } else {
      res.status(400).send({ message: "latihan sudah ada" });
    }
  } catch (error) {
    console.error("error add document", error);
  }
};

module.exports = {
  viewArticleMethod,
  signInMemberMethod,
  signUpMemberMethod,
  signInAdminMethod,
  signUpAdminMethod,
  firstInputMethod,
  getOneMemberMethod,
  getAllMemberMethod,
  postArticleMethod,
  getAllArticleMethod,
  viewArticleOnceMethod,
  getArticleSeenMethode,
  postLatihanMethode,
  viewLatihanOnceMethod,
  getLatihanSeenMethode,
  getAllLatihanMethode,
  getAllTest,
  getAllScore,
  getPostScore,
};
