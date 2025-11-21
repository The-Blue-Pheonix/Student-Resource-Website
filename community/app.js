// EduSync App – simple JS to wire up pages and micro-interactions
(function () {
  const page = document.body.getAttribute('data-page');

  // Basic mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Local storage helpers
  const storage = {
    saveProfile(p) { localStorage.setItem('edusync_profile', JSON.stringify(p)); },
    getProfile() { try { return JSON.parse(localStorage.getItem('edusync_profile')||'null'); } catch { return null; } },
    saveConnections(list) { localStorage.setItem('edusync_connections', JSON.stringify(list)); },
    getConnections() { try { return JSON.parse(localStorage.getItem('edusync_connections')||'[]'); } catch { return []; } },
  };

  const defaultSkills = ['HTML','CSS','JavaScript','Python','Java','C++','React','Node','SQL','UI/UX','Data Analysis'];
  const sampleUsers = [
    { id:1, name:'Ava Kim', dept:'Computer Science', year:'2nd', level:'Intermediate', avatar:'AK', know:['HTML','CSS','JavaScript'], learn:['Python','React'], interests:['Web','Design'] },
    { id:2, name:'Ben Li', dept:'Information Systems', year:'1st', level:'Beginner', avatar:'BL', know:['Python','SQL'], learn:['HTML','CSS','JavaScript'], interests:['Data','Web'] },
    { id:3, name:'Chloe Park', dept:'Design', year:'3rd', level:'Mentor', avatar:'CP', know:['UI/UX','HTML','CSS'], learn:['JavaScript'], interests:['Design','Accessibility'] },
    { id:4, name:'Diego Ortiz', dept:'Software Eng', year:'2nd', level:'Intermediate', avatar:'DO', know:['Java','C++','Data Analysis'], learn:['Python','SQL'], interests:['Algorithms','Data'] },
  ];

  function computeMatchScore(me, other) {
    if (!me) return 0;
    const teach = me.know.filter(s => other.learn.includes(s)).length;
    const learn = me.learn.filter(s => other.know.includes(s)).length;
    const shared = (me.interests||[]).filter(i => (other.interests||[]).includes(i)).length;
    const raw = teach*0.45 + learn*0.45 + shared*0.1;
    return Math.min(99, Math.round(50 + raw*25));
  }

  // LANDING – no special JS beyond nav toggle

  // PROFILE PAGE
  if (page === 'profile') {
    const chipsKnow = document.getElementById('chipsKnow');
    const chipsLearn = document.getElementById('chipsLearn');
    const customSkill = document.getElementById('customSkill');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const email = document.getElementById('email');

    // Pre-fill readonly email for demo
    email.value = 'student@edu.edu';

    function renderChips(container, skills) {
      container.innerHTML = '';
      skills.forEach(s => {
        const el = document.createElement('span');
        el.className = 'chip';
        el.textContent = s;
        el.addEventListener('click', () => el.classList.toggle('selected'));
        container.appendChild(el);
      });
    }
    renderChips(chipsKnow, defaultSkills.slice(0,6));
    renderChips(chipsLearn, defaultSkills.slice(6));

    addSkillBtn.addEventListener('click', () => {
      const val = customSkill.value.trim();
      if (!val) return;
      const el = document.createElement('span');
      el.className = 'chip selected';
      el.textContent = val;
      chipsLearn.appendChild(el);
      customSkill.value = '';
    });

    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        avatarPreview.style.backgroundImage = `url(${reader.result})`;
        avatarPreview.style.backgroundSize = 'cover';
        avatarPreview.textContent = '';
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('profileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const know = Array.from(chipsKnow.querySelectorAll('.chip.selected')).map(c => c.textContent);
      const learn = Array.from(chipsLearn.querySelectorAll('.chip.selected')).map(c => c.textContent);
      const p = {
        name: document.getElementById('name').value.trim(),
        email: email.value,
        level: document.getElementById('level').value,
        know, learn,
        interests: ['Web','Design']
      };
      storage.saveProfile(p);
      window.location.href = 'matches.html';
    });
  }

  // MATCHES PAGE
  if (page === 'matches') {
    const me = storage.getProfile() || { know:['HTML','CSS'], learn:['JavaScript'], interests:['Web'] };
    const grid = document.getElementById('matchesGrid');
    const search = document.getElementById('searchInput');
    const levelFilter = document.getElementById('levelFilter');
    const interestFilter = document.getElementById('interestFilter');

    function render(users) {
      grid.innerHTML = '';
      users.forEach(u => {
        const score = computeMatchScore(me,u);
        const card = document.createElement('div');
        card.className = 'match-card hover-lift';
        card.innerHTML = `
          <div class="avatar small">${u.avatar}</div>
          <div>
            <h3 class="match-title">${u.name}</h3>
            <p class="match-sub">${u.dept}, ${u.year} · ${u.level}</p>
            <div class="match-chip-group"><strong>You can teach:</strong> ${me.know.filter(s=>u.learn.includes(s)).map(s=>`<span class='chip'>${s}</span>`).join('')}</div>
            <div class="match-chip-group"><strong>They can help you learn:</strong> ${me.learn.filter(s=>u.know.includes(s)).map(s=>`<span class='chip'>${s}</span>`).join('')}</div>
            ${(u.interests&&me.interests)?`<div class="match-chip-group"><strong>Shared interests:</strong> ${u.interests.filter(i=>me.interests.includes(i)).map(i=>`<span class='chip'>${i}</span>`).join('')}</div>`:''}
            <button class="btn btn-primary connect-btn" data-id="${u.id}">Connect</button>
          </div>
          <div class="badge">${score}% Match</div>
        `;
        grid.appendChild(card);
      });
      Array.from(grid.querySelectorAll('.connect-btn')).forEach(btn => {
        btn.addEventListener('click', () => {
          const id = Number(btn.getAttribute('data-id'));
          const u = sampleUsers.find(s=>s.id===id);
          const conns = storage.getConnections();
          if (!conns.find(c=>c.id===id)) conns.push(u);
          storage.saveConnections(conns);
          btn.textContent = 'Connected';
          btn.disabled = true;
        });
      });
    }

    function applyFilters() {
      const q = search.value.toLowerCase();
      const lvl = levelFilter.value;
      const interest = interestFilter.value.toLowerCase();
      const filtered = sampleUsers.filter(u =>
        (!lvl || u.level === lvl) &&
        (!interest || (u.interests||[]).some(i=>i.toLowerCase().includes(interest))) &&
        (!q || u.name.toLowerCase().includes(q) || u.know.join(',').toLowerCase().includes(q) || u.learn.join(',').toLowerCase().includes(q))
      );
      render(filtered);
    }

    [search, levelFilter, interestFilter].forEach(el => el.addEventListener('input', applyFilters));
    render(sampleUsers);
  }

  // CHAT PAGE
  if (page === 'chat') {
    const users = storage.getConnections();
    const userList = document.getElementById('userList');
    const messagesEl = document.getElementById('chatMessages');
    const headerName = document.getElementById('chatName');
    const headerMeta = document.getElementById('chatMeta');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    const conversations = {}; // id -> messages
    function addMessage(id, who, text) {
      conversations[id] = conversations[id] || [];
      conversations[id].push({ who, text, ts: Date.now() });
    }

    function renderUsers() {
      userList.innerHTML = '';
      (users.length? users : sampleUsers).forEach(u => {
        const li = document.createElement('li');
        li.innerHTML = `<div class='avatar small'>${u.avatar}</div><div>${u.name}</div>`;
        li.addEventListener('click', () => selectUser(u, li));
        userList.appendChild(li);
      });
    }
    function selectUser(u, li) {
      Array.from(userList.children).forEach(x => x.classList.remove('active'));
      li.classList.add('active');
      headerName.textContent = u.name;
      headerMeta.textContent = `${u.dept}, ${u.year} · ${u.level}`;
      messagesEl.innerHTML = '';
      (conversations[u.id]||[]).forEach(m => {
        const b = document.createElement('div');
        b.className = `chat-bubble ${m.who}`;
        b.textContent = m.text;
        messagesEl.appendChild(b);
      });
      sendBtn.onclick = () => {
        const val = messageInput.value.trim();
        if (!val) return;
        addMessage(u.id,'me',val);
        const meBubble = document.createElement('div');
        meBubble.className = 'chat-bubble me'; meBubble.textContent = val; messagesEl.appendChild(meBubble);
        messageInput.value='';
        setTimeout(() => {
          const reply = `Great idea! Let's schedule a session.`;
          addMessage(u.id,'them',reply);
          const themBubble = document.createElement('div');
          themBubble.className = 'chat-bubble them'; themBubble.textContent = reply; messagesEl.appendChild(themBubble);
        }, 800);
      };
    }
    renderUsers();
  }

  // DASHBOARD PAGE
  if (page === 'dashboard') {
    const statConnections = document.getElementById('statConnections');
    const statSkills = document.getElementById('statSkills');
    const statSessions = document.getElementById('statSessions');
    const recommendedSkills = document.getElementById('recommendedSkills');
    const goalsList = document.getElementById('goalsList');
    const profile = storage.getProfile() || { learn:['JavaScript','React','Python'] };

    const conns = storage.getConnections();
    statConnections.textContent = String(conns.length);
    statSkills.textContent = String(Math.max(1, Math.floor((conns.length+1)/2)));
    statSessions.textContent = String(conns.length * 2);

    // Recommended skills are those not yet in know but in learn
    (profile.learn||[]).forEach(s => {
      const el = document.createElement('span'); el.className = 'chip'; el.textContent = s; recommendedSkills.appendChild(el);
    });

    const goals = (profile.learn||[]).map(s => ({ name: s, progress: Math.floor(Math.random()*60)+20 }));
    goals.forEach(g => {
      const row = document.createElement('div');
      row.innerHTML = `<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;'><strong>${g.name}</strong><span class='muted'>${g.progress}%</span></div><div class='progress'><div class='progress-bar' style='width:${g.progress}%'></div></div>`;
      goalsList.appendChild(row);
    });
  }
})();