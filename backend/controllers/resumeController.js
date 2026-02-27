const fs=require("node:fs");
const path=require("node:path");
const Resume=require("../Models/Resume");

//@desc Create a new Resume
//@route POST/api/resumes
//@access Private
const createResume=async(req,res)=>{
    try{

        const {title} = req.body;

        //Default template
        const defaultResumeData={
            profileInfo:{
                profileImg:null,
                previewUrl:"",
                fullName:"",
                designation:"",
                summary:"",
            },
            contactInfo:{
                email:"",
                phone:"",
                location:"",
                linkedin:"",
                github:"",
                website:"",
            },
            workExperience:[
                {
                    comapny:"",
                    role:"",
                    startDate:"",
                    endDate:"",
                    description:"",
                },
            ],
            education:[
                {
                    desgree:"",
                    institution:"",
                    startDate:"",
                    endDate:"",
                },
            ],
            skills:[
                {
                    name:"",
                    progress:0,
                },
            ],
            projects:[
                {
                    title:"",
                    description:"",
                    github:"",
                    liveDemo:"",
                },
            ],
            certifications:[
                {
                    title:"",
                    issuer:"",
                    year:"",
                },
            ],
            languages:[
                {
                    name:"",
                    progress:0,
                },
            ],
            interests:[""],
        };

        const newResume = await Resume.create({
            userId : req.user._id,
            title,
             template: req.body.template || { theme: "01", colorPalette: [] }, // ✅ add this
  ...defaultResumeData,
            ...defaultResumeData,
        });

        res.status(201).json({newResume});
    }catch(error){
        res
        .status(500)
        .json({message:"Failed to create resume",error:error.message});
    }
};


//@desc Get all resumes for logged-in user
//@route GET /api/resumes
//@access Private
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });

    const baseUrl = process.env.BASE_URL;
    const fixedResumes = resumes.map((r) => {
      if (r.thumbnailLink?.includes("localhost")) {
        r.thumbnailLink = r.thumbnailLink.replace("http://localhost:8000", baseUrl);
      }
      if (r.profileInfo?.profilePreviewUrl?.includes("localhost")) {
        r.profileInfo.profilePreviewUrl = r.profileInfo.profilePreviewUrl.replace(
          "http://localhost:8000",
          baseUrl
        );
      }
      return r;
    });

    res.json(fixedResumes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resumes", error: error.message });
  }
};


//@desc Get single resume by ID
//@route GET /api/resumes/:id
//@access Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // 🧠 Fix any localhost URLs for images
    const baseUrl = process.env.BASE_URL;
    if (resume.thumbnailLink?.includes("localhost")) {
      resume.thumbnailLink = resume.thumbnailLink.replace(
        "http://localhost:8000",
        baseUrl
      );
    }

    if (resume.profileInfo?.profilePreviewUrl?.includes("localhost")) {
      resume.profileInfo.profilePreviewUrl =
        resume.profileInfo.profilePreviewUrl.replace(
          "http://localhost:8000",
          baseUrl
        );
    }

    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get resume", error: error.message });
  }
};


//@desc Update a resume
//@route PUT /api/resumes/:id
//@access Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    const updates = { ...req.body };

    // 🧠 Prevent overwriting valid image URLs with empty strings
    if (updates.thumbnailLink === "") delete updates.thumbnailLink;

    // Same for profile image if needed
    if (
      updates.profileInfo &&
      updates.profileInfo.profilePreviewUrl === ""
    ) {
      delete updates.profileInfo.profilePreviewUrl;
    }

    // ✅ Perform safe deep merge (avoid overwriting nested objects)
    const mergeDeep = (target, source) => {
      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          if (!target[key]) target[key] = {};
          mergeDeep(target[key], source[key]);
        } else if (source[key] !== undefined && source[key] !== "") {
          target[key] = source[key];
        }
      }
    };

    mergeDeep(resume, req.body);

    // console.log("Resumes fetched:", resume);


    // Save updated resume
    const savedResume = await resume.save();
    res.json(savedResume);

  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update resume", error: error.message });
  }
};


//@desc Delete a resume
//@route DELETE/api/resumes/:id
//@access Private
const deleteResume = async(req,res)=>{
    try{
        const resume=await Resume.findOne({
            _id:req.params.id,
            userId:req.user._id,
        });
        if(!resume){
            return res.status(404).json({message:"Resume not found or unauthorized"});
        }

        //Delete thumbnailLink and profileviewUrl images from uploads folder
        const uploadsFolder=path.join(__dirname,"..","uploads");
        const baseUrl=`${req.protocol}://${req.get("host")}`;

        if(resume.thumbnailLink){
            const oldThumbnail=path.join(uploadsFolder,path.basename(resume.thumbnailLink));
            if(fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }

        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(
           uploadsFolder,
           path.basename(resume.profileInfo.profilePreviewUrl)
        );
        if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }


        const deleted=await Resume.findOneAndDelete({
            _id:req.params.id,
            userId:req.user._id,
        });

        if(!deleted){
            return res.status(404).json({message:"Resume not found or unauthorized"});
        }

        res.json({message:"Resume deleted successfully"});
    }catch(error){
        res
        .status(500)
        .json({message:"Failed to get resume",error:error.message});
    }
};

module.exports={
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
};