import axios from 'axios';

// Initialize a standard Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Out-of-the-box local database presets for standalone preview
const SEED_USERS = [
  {
    _id: 'usr-student',
    name: 'Aravind Swamy',
    email: 'mockstudent@example.com',
    password: 'password123',
    roomNumber: '204-B',
    hostelBlock: 'C Block',
    phone: '+919988776655',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'student'
  },
  {
    _id: 'usr-admin',
    name: 'Hostel Chief Warden',
    email: 'mockadmin@example.com',
    password: 'password123',
    phone: '+19876543210',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'admin'
  }
];

const SEED_COMPLAINTS = [
  {
    _id: 'c-1',
    title: 'Water leaking from toilet flush tank',
    description: 'The flush tank in my room bathroom is leaking continuously, making the toilet floor extremely wet and slippery. It is wasting water.',
    category: 'Water',
    priority: 'High',
    status: 'Pending',
    student: { _id: 'usr-student', name: 'Aravind Swamy', email: 'mockstudent@example.com', roomNumber: '204-B', hostelBlock: 'C Block', phone: '+919988776655' },
    assignedStaff: '',
    aiSummary: '[AI Diagnostic] Identified Plumbing / Water supply issue. Requires plumber visit for leak repair or valve inspection. Urgency rating: Immediate Action Required.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    images: []
  },
  {
    _id: 'c-2',
    title: 'Ceiling fan making squeaking noise',
    description: 'The ceiling fan in my room makes a very loud squeaking noise when run on high speed, which prevents me from sleeping or studying.',
    category: 'Electrical',
    priority: 'Medium',
    status: 'Accepted',
    student: { _id: 'usr-student', name: 'Aravind Swamy', email: 'mockstudent@example.com', roomNumber: '204-B', hostelBlock: 'C Block', phone: '+919988776655' },
    assignedStaff: 'Electrical Unit',
    aiSummary: '[AI Diagnostic] Identified Electrical appliance issue. Electrician inspect fixture replacement or wiring reconnect. Urgency rating: Standard.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    images: []
  },
  {
    _id: 'c-3',
    title: 'Extremely slow Wi-Fi connection',
    description: 'Wi-Fi connection speeds are below 1 Mbps in the evening, making it impossible to access online lectures and programming portals.',
    category: 'Internet',
    priority: 'Low',
    status: 'Resolved',
    student: { _id: 'usr-student', name: 'Aravind Swamy', email: 'mockstudent@example.com', roomNumber: '204-B', hostelBlock: 'C Block', phone: '+919988776655' },
    assignedStaff: 'IT Support Team',
    aiSummary: '[AI Diagnostic] Identified Network connectivity fault. IT administrator needs to check port activation or router status. Urgency rating: Standard.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    images: []
  }
];

const SEED_NOTIFICATIONS = [
  {
    _id: 'n-1',
    user: 'usr-student',
    message: 'Welcome to the Hostel Complaint Management Portal! You can now raise issues and track them in real time.',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    _id: 'n-2',
    user: 'usr-student',
    message: 'Your Wi-Fi complaint has been updated to Resolved by Admin.',
    read: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

// In-Browser Database Helper
const initLocalDb = () => {
  if (!localStorage.getItem('hc_users')) {
    localStorage.setItem('hc_users', JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem('hc_complaints')) {
    localStorage.setItem('hc_complaints', JSON.stringify(SEED_COMPLAINTS));
  }
  if (!localStorage.getItem('hc_notifications')) {
    localStorage.setItem('hc_notifications', JSON.stringify(SEED_NOTIFICATIONS));
  }
};
initLocalDb();

const getLocalData = (key) => JSON.parse(localStorage.getItem(key));
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Retrieve active user from JWT stored locally
const getActiveUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const users = getLocalData('hc_users');
  return users.find(u => u._id === token) || null;
};

// Allow real backend requests by default in development.
let serverOffline = false;

// Request Interceptor: Attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth failures globally
api.interceptors.response.use(
  (response) => {
    serverOffline = false; // Server is reachable!
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(error);
  }
);

// --- AXIOS MOCK WRAPPERS ---
// If the backend server fails or is unreachable, the following interceptors take action.

const mockResponse = (data) => ({
  data: { success: true, ...data },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

const mockError = (message, status = 400) => {
  const err = new Error(message);
  err.response = {
    data: { success: false, message },
    status
  };
  return Promise.reject(err);
};

// Override axios request methods if running in pure preview / offline mode
const executeMockRequest = async (method, url, data = null, config = {}) => {
  console.log(`[API Mock] Intercepted request: ${method.toUpperCase()} ${url}`);
  initLocalDb();

  // 1. Auth Routing
  if (url === '/auth/login') {
    const { email, password } = data;
    const users = getLocalData('hc_users');
    const user = users.find(u => u.email === email);
    if (user && user.password === password) {
      localStorage.setItem('token', user._id);
      return mockResponse({ token: user._id, user });
    }
    return mockError('Invalid email or password', 401);
  }

  if (url === '/auth/register') {
    const { name, email, password, phone, roomNumber, hostelBlock, avatar } = data;
    const users = getLocalData('hc_users');
    if (users.find(u => u.email === email)) {
      return mockError('User already exists');
    }
    const newUser = {
      _id: 'usr-' + Date.now(),
      name,
      email,
      password,
      phone,
      roomNumber,
      hostelBlock,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      role: 'student'
    };
    users.push(newUser);
    setLocalData('hc_users', users);
    localStorage.setItem('token', newUser._id);
    return mockResponse({ token: newUser._id, user: newUser });
  }

  const currentUser = getActiveUser();
  if (!currentUser) {
    return mockError('Not authorized, no token', 401);
  }

  if (url === '/auth/profile') {
    if (method === 'get') {
      return mockResponse({ user: currentUser });
    }
    if (method === 'put') {
      const users = getLocalData('hc_users');
      const idx = users.findIndex(u => u._id === currentUser._id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        setLocalData('hc_users', users);
        return mockResponse({ user: users[idx] });
      }
      return mockError('User not found', 404);
    }
  }

  if (url === '/auth/password') {
    const { currentPassword, newPassword } = data;
    const users = getLocalData('hc_users');
    const idx = users.findIndex(u => u._id === currentUser._id);
    if (idx !== -1 && users[idx].password === currentPassword) {
      users[idx].password = newPassword;
      setLocalData('hc_users', users);
      return mockResponse({ message: 'Password updated successfully' });
    }
    return mockError('Incorrect current password');
  }

  // 2. Student Complaints Routing
  if (url === '/complaints') {
    const complaints = getLocalData('hc_complaints');
    if (method === 'get') {
      // Filter student's own complaints
      let filtered = complaints.filter(c => c.student?._id === currentUser._id);
      const params = config.params || {};

      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(c => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
      }
      if (params.category && params.category !== 'All') {
        filtered = filtered.filter(c => c.category === params.category);
      }
      if (params.status && params.status !== 'All') {
        filtered = filtered.filter(c => c.status === params.status);
      }
      if (params.priority && params.priority !== 'All') {
        filtered = filtered.filter(c => c.priority === params.priority);
      }

      // Sort recent first
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return mockResponse({ complaints: filtered });
    }

    if (method === 'post') {
      // Handle Lodging
      // data is FormData, parse values
      const title = data.get('title');
      const description = data.get('description');
      const category = data.get('category');
      const priority = data.get('priority');
      const imagesFiles = data.getAll('images');

      const imagePaths = imagesFiles.map((file, idx) => URL.createObjectURL(file));

      // Quick heuristic draft summary
      const text = `${title} ${description}`.toLowerCase();
      let urgency = 'Standard';
      if (text.includes('leak') || text.includes('wire') || text.includes('shock')) urgency = 'Urgent Action Recommended';
      const aiSummary = `[Diagnostic Preview] Local mock diagnostic flagged category: ${category}. Suggested priority: ${priority}. Urgency: ${urgency}.`;

      const newComplaint = {
        _id: 'c-' + Date.now(),
        title,
        description,
        category,
        priority,
        status: 'Pending',
        student: {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          roomNumber: currentUser.roomNumber,
          hostelBlock: currentUser.hostelBlock,
          phone: currentUser.phone
        },
        assignedStaff: '',
        aiSummary,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: imagePaths
      };

      complaints.push(newComplaint);
      setLocalData('hc_complaints', complaints);

      // Trigger notification
      const notifications = getLocalData('hc_notifications');
      notifications.unshift({
        _id: 'n-' + Date.now(),
        user: currentUser._id,
        message: `Your complaint "${title}" has been registered successfully. Track updates on your dashboard.`,
        read: false,
        createdAt: new Date().toISOString()
      });
      setLocalData('hc_notifications', notifications);

      return mockResponse({ complaint: newComplaint });
    }
  }

  if (url.startsWith('/complaints/')) {
    const id = url.split('/')[2];
    const complaints = getLocalData('hc_complaints');
    const complaintIdx = complaints.findIndex(c => c._id === id);

    if (complaintIdx === -1) {
      return mockError('Complaint not found', 404);
    }

    if (method === 'get') {
      return mockResponse({ complaint: complaints[complaintIdx] });
    }

    if (method === 'put') {
      // Edit complaint (requires Pending status check)
      const c = complaints[complaintIdx];
      if (c.status !== 'Pending') {
        return mockError('Cannot update complaint already accepted/resolved');
      }

      const title = data.get('title');
      const description = data.get('description');
      const category = data.get('category');
      const priority = data.get('priority');

      c.title = title || c.title;
      c.description = description || c.description;
      c.category = category || c.category;
      c.priority = priority || c.priority;
      c.updatedAt = new Date().toISOString();

      complaints[complaintIdx] = c;
      setLocalData('hc_complaints', complaints);
      return mockResponse({ complaint: c });
    }

    if (method === 'delete') {
      const c = complaints[complaintIdx];
      if (c.status !== 'Pending') {
        return mockError('Cannot delete complaint already accepted/resolved');
      }
      complaints.splice(complaintIdx, 1);
      setLocalData('hc_complaints', complaints);
      return mockResponse({ message: 'Complaint deleted successfully' });
    }
  }

  // 3. Admin Control Panel Routing
  if (url === '/admin/dashboard') {
    const complaints = getLocalData('hc_complaints');
    const users = getLocalData('hc_users').filter(u => u.role === 'student');

    const totalStudents = users.length;
    const totalComplaints = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const accepted = complaints.filter(c => c.status === 'Accepted').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const rejected = complaints.filter(c => c.status === 'Rejected').length;

    // Compile breakdown
    const categoriesBreakdown = [];
    complaints.forEach(c => {
      const existing = categoriesBreakdown.find(item => item._id === c.category);
      if (existing) {
        existing.count += 1;
      } else {
        categoriesBreakdown.push({ _id: c.category, count: 1 });
      }
    });

    return mockResponse({
      stats: {
        totalStudents,
        totalComplaints,
        status: { pending, accepted, inProgress, resolved, rejected },
        categories: categoriesBreakdown,
        recentComplaints: complaints.slice(-5)
      }
    });
  }

  if (url === '/admin/complaints') {
    const complaints = getLocalData('hc_complaints');
    const params = config.params || {};
    let filtered = [...complaints];

    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(s) || 
        c.description.toLowerCase().includes(s) || 
        (c.student?.name || '').toLowerCase().includes(s)
      );
    }
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(c => c.category === params.category);
    }
    if (params.status && params.status !== 'All') {
      filtered = filtered.filter(c => c.status === params.status);
    }
    if (params.priority && params.priority !== 'All') {
      filtered = filtered.filter(c => c.priority === params.priority);
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return mockResponse({ complaints: filtered });
  }

  if (url.startsWith('/admin/complaints/') && url.endsWith('/status')) {
    const id = url.split('/')[3];
    const { status, assignedStaff } = data;
    const complaints = getLocalData('hc_complaints');
    const idx = complaints.findIndex(c => c._id === id);

    if (idx !== -1) {
      const c = complaints[idx];
      c.status = status;
      if (assignedStaff !== undefined) {
        c.assignedStaff = assignedStaff;
      }
      c.updatedAt = new Date().toISOString();
      complaints[idx] = c;
      setLocalData('hc_complaints', complaints);

      // Create student notification
      const notifications = getLocalData('hc_notifications');
      notifications.unshift({
        _id: 'n-' + Date.now(),
        user: c.student?._id,
        message: `Your complaint "${c.title}" status has been updated to "${status}"${assignedStaff ? ` and assigned to "${assignedStaff}"` : ''}.`,
        read: false,
        createdAt: new Date().toISOString()
      });
      setLocalData('hc_notifications', notifications);

      return mockResponse({ complaint: c });
    }
    return mockError('Complaint not found', 404);
  }

  if (url.startsWith('/admin/complaints/') && method === 'delete') {
    const id = url.split('/')[3];
    const complaints = getLocalData('hc_complaints');
    const idx = complaints.findIndex(c => c._id === id);
    if (idx !== -1) {
      complaints.splice(idx, 1);
      setLocalData('hc_complaints', complaints);
      return mockResponse({ message: 'Complaint deleted by Admin' });
    }
    return mockError('Complaint not found', 404);
  }

  if (url === '/admin/users') {
    if (method === 'get') {
      const users = getLocalData('hc_users').filter(u => u.role === 'student');
      return mockResponse({ users });
    }

    if (method === 'post') {
      const { name, email, password, phone, roomNumber, hostelBlock, avatar, role } = data;
      const users = getLocalData('hc_users');

      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return mockError('A user with that email already exists');
      }

      const newUser = {
        _id: 'usr-' + Date.now(),
        name,
        email,
        password,
        phone,
        roomNumber,
        hostelBlock,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        role: role || 'student'
      };
      users.push(newUser);
      setLocalData('hc_users', users);
      return mockResponse({ user: newUser });
    }
  }

  if (url.startsWith('/admin/users/') && method === 'delete') {
    const id = url.split('/')[3];
    const users = getLocalData('hc_users');
    const idx = users.findIndex(u => u._id === id);
    if (idx !== -1) {
      users.splice(idx, 1);
      setLocalData('hc_users', users);
      // Clean up their complaints
      const complaints = getLocalData('hc_complaints').filter(c => c.student?._id !== id);
      setLocalData('hc_complaints', complaints);
      return mockResponse({ message: 'Student removed successfully' });
    }
    return mockError('Student profile not found', 404);
  }

  // 4. Notifications Routing
  if (url === '/notifications') {
    const notifications = getLocalData('hc_notifications');
    const filtered = notifications.filter(n => n.user === currentUser._id);
    return mockResponse({ notifications: filtered });
  }

  if (url === '/notifications/read') {
    const notifications = getLocalData('hc_notifications');
    notifications.forEach(n => {
      if (n.user === currentUser._id) n.read = true;
    });
    setLocalData('hc_notifications', notifications);
    return mockResponse({ message: 'All notifications marked as read' });
  }

  if (url.startsWith('/notifications/') && url.endsWith('/read')) {
    const id = url.split('/')[2];
    const notifications = getLocalData('hc_notifications');
    const idx = notifications.findIndex(n => n._id === id);
    if (idx !== -1) {
      notifications[idx].read = true;
      setLocalData('hc_notifications', notifications);
      return mockResponse({ notification: notifications[idx] });
    }
    return mockError('Notification not found', 404);
  }

  return mockError('Mock API route not supported', 404);
};

// Bind our in-browser mock wrapper to intercept Axios if serverOffline is active
const requestMockInterceptors = (method) => {
  return async (url, dataOrConfig = null, config = {}) => {
    if (serverOffline) {
      let data = null;
      let finalConfig = config;
      
      if (method === 'get' || method === 'delete') {
        finalConfig = dataOrConfig || {};
      } else {
        data = dataOrConfig;
      }
      
      try {
        return await executeMockRequest(method, url, data, finalConfig);
      } catch (err) {
        throw err;
      }
    } else {
      // Call default Axios method
      if (method === 'get') return api.get(url, dataOrConfig);
      if (method === 'delete') return api.delete(url, dataOrConfig);
      return api[method](url, dataOrConfig, config);
    }
  };
};

const customApiMock = {
  get: requestMockInterceptors('get'),
  post: requestMockInterceptors('post'),
  put: requestMockInterceptors('put'),
  delete: requestMockInterceptors('delete'),
  defaults: api.defaults,
  interceptors: api.interceptors
};

export default customApiMock;
