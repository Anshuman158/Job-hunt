import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";
import { ApiError } from "../utils/ApiError.js";

export const registerCompany = async (req, res, next) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return next(new ApiError(400, "Company name is required."));
        }

        if (!isDbConnected()) {
            const existing = mockStore.companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
            if (existing) {
                return next(new ApiError(409, "A company with this name already exists."));
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
            return next(new ApiError(409, "A company with this name already exists."));
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
        next(error);
    }
};

export const getCompany = async (req, res, next) => {
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
        next(error);
    }
};

export const getCompanyById = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        if (!isDbConnected()) {
            const company = mockStore.companies.find(c => c._id.toString() === companyId.toString());
            if (!company) {
                return next(new ApiError(404, "Company not found."));
            }
            return res.status(200).json({
                company,
                success: true
            });
        }
        const company = await Company.findById(companyId);
        if (!company) {
            return next(new ApiError(404, "Company not found."));
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        next(error);
    }
};

export const updateCompany = async (req, res, next) => {
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
                return next(new ApiError(404, "Company not found."));
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

        const updateData = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (website !== undefined) updateData.website = website;
        if (location !== undefined) updateData.location = location;
        if (logoUrl) updateData.logo = logoUrl;

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!company) {
            return next(new ApiError(404, "Company not found."));
        }
        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        });

    } catch (error) {
        next(error);
    }
};
