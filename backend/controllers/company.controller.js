import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        if (!isDbConnected()) {
            const existing = mockStore.companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
            if (existing) {
                return res.status(400).json({
                    message: "You can't register same company.",
                    success: false
                });
            }
            const newCompany = {
                _id: "cmp_" + Date.now().toString(),
                name: companyName,
                description: "",
                website: "",
                location: "",
                logo: "",
                userId: req.id,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockStore.companies.push(newCompany);
            return res.status(201).json({
                message: "Company registered successfully.",
                company: newCompany,
                success: true
            });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Register company error:", error);
        return res.status(500).json({
            message: "Internal server error during company registration",
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        if (!isDbConnected()) {
            const companies = mockStore.companies.filter(c => c.userId.toString() === userId.toString());
            return res.status(200).json({
                companies,
                success: true
            });
        }
        const companies = await Company.find({ userId });
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error("Get company error:", error);
        return res.status(500).json({
            message: "Internal server error getting companies",
            success: false
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        if (!isDbConnected()) {
            const company = mockStore.companies.find(c => c._id.toString() === companyId.toString());
            if (!company) {
                return res.status(404).json({
                    message: "Company not found.",
                    success: false
                });
            }
            return res.status(200).json({
                company,
                success: true
            });
        }
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error("Get company by id error:", error);
        return res.status(500).json({
            message: "Internal server error getting company details",
            success: false
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        let logoUrl;
        if (file) {
            const fileUri = getDataUri(file);
            logoUrl = fileUri.content;
        }

        if (!isDbConnected()) {
            const company = mockStore.companies.find(c => c._id.toString() === req.params.id.toString());
            if (!company) {
                return res.status(404).json({
                    message: "Company not found.",
                    success: false
                });
            }
            if (name) company.name = name;
            if (description !== undefined) company.description = description;
            if (website !== undefined) company.website = website;
            if (location !== undefined) company.location = location;
            if (logoUrl) company.logo = logoUrl;
            company.updatedAt = new Date();

            return res.status(200).json({
                message: "Company information updated.",
                company,
                success: true
            });
        }

        const updateData = { name, description, website, location };
        if (logoUrl) {
            updateData.logo = logoUrl;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Update company error:", error);
        return res.status(500).json({
            message: "Internal server error updating company",
            success: false
        });
    }
};
