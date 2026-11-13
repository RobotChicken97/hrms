import { createRouter, createWebHistory } from "@ionic/vue-router"

import TabbedView from "@/views/TabbedView.vue"
import attendanceRoutes from "./attendance"
import leaveRoutes from "./leaves"

const routes = [
	{
		path: "/",
		redirect: "/home",
	},
	{
		path: "/",
		component: TabbedView,
		children: [
			{
				path: "",
				redirect: "/home",
			},
			{
				path: "/home",
				name: "Home",
				component: () => import("@/views/Home.vue"),
			},
			{
				path: "/dashboard/attendance",
				name: "AttendanceDashboard",
				component: () => import("@/views/attendance/Dashboard.vue"),
			},
			{
				path: "/dashboard/leaves",
				name: "LeavesDashboard",
				component: () => import("@/views/leave/Dashboard.vue"),
			},
		],
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/Login.vue"),
	},
	{
		path: "/profile",
		name: "Profile",
		component: () => import("@/views/Profile.vue"),
	},
	{
		path: "/notifications",
		name: "Notifications",
		component: () => import("@/views/Notifications.vue"),
	},
	{
		path: "/settings",
		name: "Settings",
		component: () => import("@/views/AppSettings.vue"),
	},
	{
		path: "/invalid-employee",
		name: "InvalidEmployee",
		component: () => import("@/views/InvalidEmployee.vue"),
	},
	...attendanceRoutes,
	...leaveRoutes,
	// AmelaStock: Salary, Expense and Advance screens are not offered to staff. Their routes are not
	// registered (see claims.js, advances.js and salary_slips.js, kept so a rebase stays small); a typed
	// address goes back to Home.
	...[
		"/expense-claims",
		"/employee-advances",
		"/salary-slips",
		"/dashboard/expense-claims",
		"/dashboard/salary-slips",
	].map((path) => ({ path: `${path}/:rest(.*)*`, redirect: "/home" })),
]

const router = createRouter({
	history: createWebHistory("/hrms"),
	routes,
})

export default router
