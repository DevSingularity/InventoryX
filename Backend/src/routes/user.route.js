import { Router } from 'express';

import { asyncHandler, requireAuth, requireRole } from '../middlewares/addHere.js';
import { createUserByAdmin, deactivateUser, getUserById, listUsers, updateUser } from '../services/auth.service.js';

const router = Router();

router.use(requireAuth);

router.get(
	'/',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const users = await listUsers(req.query);
		res.status(200).json(users);
	})
);

router.get(
	'/employees',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const employees = await listUsers({ ...req.query, role: 'employee' });
		res.status(200).json(employees);
	})
);

router.get(
	'/employees/:id',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const user = await getUserById(req.params.id);
		if (user.role !== 'employee') {
			return res.status(404).json({ message: 'Employee not found' });
		}
		res.status(200).json(user);
	})
);

router.post(
	'/employees',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const { email, full_name, is_active, password } = req.body;
		if (!email || !full_name) {
			return res.status(400).json({ message: 'email and full_name are required' });
		}
		const user = await createUserByAdmin({
			email,
			full_name,
			role: 'employee',
			is_active,
			password,
		});
		res.status(201).json(user);
	})
);

router.patch(
	'/employees/:id',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const user = await getUserById(req.params.id);
		if (user.role !== 'employee') {
			return res.status(404).json({ message: 'Employee not found' });
		}
		const updated = await updateUser(req.params.id, { ...req.body, role: 'employee' });
		res.status(200).json(updated);
	})
);

router.delete(
	'/employees/:id',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const user = await getUserById(req.params.id);
		if (user.role !== 'employee') {
			return res.status(404).json({ message: 'Employee not found' });
		}
		const row = await deactivateUser(req.params.id);
		res.status(200).json(row);
	})
);

router.get(
	'/:id',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const user = await getUserById(req.params.id);
		res.status(200).json(user);
	})
);

router.post(
	'/',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const { email, full_name, role, is_active } = req.body;
		if (!email || !full_name) {
			return res.status(400).json({ message: 'email and full_name are required' });
		}
		const user = await createUserByAdmin({ email, full_name, role, is_active });
		res.status(201).json(user);
	})
);

router.patch(
	'/:id',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const user = await updateUser(req.params.id, req.body);
		res.status(200).json(user);
	})
);

router.delete(
	'/:id',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const row = await deactivateUser(req.params.id);
		res.status(200).json(row);
	})
);

export default router;
