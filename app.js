// app.js - Manejo central para páginas
(function(){
  // Helper
  const qs = sel => document.querySelector(sel);
  const qsa = sel => document.querySelectorAll(sel);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);

  // Initial data seed
  function seedData(){
    if(!localStorage.getItem('es_seeded')){
      const products = [
        {id:uid(), name:'Papas rellenas', price:7000},
        {id:uid(), name:'Empanada de pollo', price:3500},
        {id:uid(), name:'Empanada de carne', price:3500},
        {id:uid(), name:'Arepa de carne', price:9000},
        {id:uid(), name:'Arepa de queso', price:8000},
        {id:uid(), name:'Avena', price:4000},
        {id:uid(), name:'Jugo mora', price:5000},
        {id:uid(), name:'Café', price:3000},
        {id:uid(), name:'Café con leche', price:3500},
        {id:uid(), name:'Chocolate', price:3500}
      ];
      const users = [
        {username:'admin', password:'admin123', role:'admin'},
        {username:'mesero', password:'1234', role:'mesero'}
      ];
      localStorage.setItem('products', JSON.stringify(products));
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('orders', JSON.stringify([]));
      localStorage.setItem('sales', JSON.stringify([]));
      localStorage.setItem('es_seeded', '1');
    }
  }

  // Load on all pages
  seedData();

  // ROUTE by filename
  const path = location.pathname.split('/').pop();

  // ---------- HOME PAGE ----------
  if(path === '' || path === 'home.html' || path === 'index.html'){
    const prodList = qs('#productosList');
    const cartItems = qs('#cartItems');
    const cartTotal = qs('#cartTotal');
    const nombreInput = qs('#clienteNombre');
    const mesaInput = qs('#mesaNumero');
    let cart = [];

    function renderProducts(){
      const products = JSON.parse(localStorage.getItem('products')||'[]');
      prodList.innerHTML = '';
      products.forEach(p=>{
        const div = document.createElement('div');
        div.className='producto-card';
        div.innerHTML = `<h4>${p.name}</h4><div class="muted">${p.price} COP</div><div style="margin-top:auto"><button class="btn add" data-id="${p.id}">Agregar</button></div>`;
        prodList.appendChild(div);
      });
      qsa('.add').forEach(b=>b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        addToCart(id);
      }));
    }

    function addToCart(id){
      const products = JSON.parse(localStorage.getItem('products')||'[]');
      const p = products.find(x=>x.id===id);
      if(!p) return;
      cart.push(p);
      renderCart();
    }

    function renderCart(){
      cartItems.innerHTML = '';
      let total = 0;
      cart.forEach((it, idx)=>{
        total += Number(it.price);
        const li = document.createElement('li');
        li.textContent = `${it.name} - ${it.price} COP `;
        const btn = document.createElement('button');
        btn.textContent='Eliminar';
        btn.className='btn ghost small';
        btn.addEventListener('click', ()=>{ cart.splice(idx,1); renderCart(); });
        li.appendChild(btn);
        cartItems.appendChild(li);
      });
      cartTotal.textContent = total;
    }

    qs('#hacerPedidoBtn').addEventListener('click', ()=>{
      const cliente = nombreInput.value.trim();
      if(cart.length===0){ qs('#msgHome').textContent='Agrega al menos un producto'; return; }
      if(!cliente){ qs('#msgHome').textContent='Ingresa nombre del cliente'; return; }
      const orders = JSON.parse(localStorage.getItem('orders')||'[]');
      const order = {
        id: uid(),
        cliente,
        mesa: mesaInput.value.trim()||'--',
        items: cart.map(c=>({id:c.id,name:c.name,price:c.price})),
        total: cart.reduce((s,i)=>s+Number(i.price),0),
        status: 'new',
        createdAt: new Date().toISOString()
      };
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      qs('#msgHome').textContent = 'Pedido creado correctamente. ID: ' + order.id;
      cart=[]; renderCart();
      nombreInput.value=''; mesaInput.value='';
      // notify could be added
      renderProducts();
    });

    renderProducts();
    renderCart();
  }

  // ---------- LOGIN PAGE ----------
  if(path === 'login.html'){
    const loginBtn = qs('#loginBtn');
    const msg = qs('#loginMsg');
    loginBtn && loginBtn.addEventListener('click', ()=>{
      const u = qs('#user').value.trim();
      const p = qs('#pass').value.trim();
      const users = JSON.parse(localStorage.getItem('users')||'[]');
      const user = users.find(x=>x.username===u && x.password===p);
      if(user){
        sessionStorage.setItem('user', JSON.stringify(user));
        if(user.role==='admin') location.href='panel-admin.html';
        else if(user.role==='mesero') location.href='panel-meseros.html';
        else location.href='home.html';
      }else{
        msg.textContent='Credenciales inválidas';
      }
    });
  }

  // ---------- PANEL MESEROS ----------
  if(path === 'panel-meseros.html'){
    const tabla = qs('#tablaMeseros');
    const logoutBtn = qs('#logoutBtn');

    function render(){
      const orders = JSON.parse(localStorage.getItem('orders')||'[]').slice().reverse();
      tabla.innerHTML = '';
      orders.forEach(o=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${o.id}</td>
                        <td>${o.cliente}</td>
                        <td>${o.items.map(i=>i.name).join(', ')}</td>
                        <td>${o.mesa}</td>
                        <td>${o.status}</td>
                        <td>
                          ${o.status === 'new' ? '<button class="btn prepare" data-id="'+o.id+'">Notificar cocina</button>' : ''}
                          ${o.status === 'preparing' ? '<button class="btn small ready" data-id="'+o.id+'">Marcar listo</button>' : ''}
                          ${o.status === 'ready' ? '<button class="btn small deliver" data-id="'+o.id+'">Entregar</button>' : ''}
                        </td>`;
        tabla.appendChild(tr);
      });
      qsa('.prepare').forEach(b=>b.addEventListener('click', e=>{ changeStatus(e.target.dataset.id,'preparing'); }));
      qsa('.ready').forEach(b=>b.addEventListener('click', e=>{ changeStatus(e.target.dataset.id,'ready'); }));
      qsa('.deliver').forEach(b=>b.addEventListener('click', e=>{ changeStatus(e.target.dataset.id,'delivered'); }));
    }

    function changeStatus(id, status){
      const orders = JSON.parse(localStorage.getItem('orders')||'[]');
      const o = orders.find(x=>x.id===id);
      if(!o) return;
      o.status = status;
      if(status==='delivered'){
        // record sale
        const sales = JSON.parse(localStorage.getItem('sales')||'[]');
        sales.push({id:o.id,total:o.total,cliente:o.cliente, date:new Date().toISOString()});
        localStorage.setItem('sales', JSON.stringify(sales));
      }
      localStorage.setItem('orders', JSON.stringify(orders));
      render();
    }

    qs('#refreshBtn') && qs('#refreshBtn').addEventListener('click', render);
    logoutBtn && logoutBtn.addEventListener('click', ()=>{ sessionStorage.removeItem('user'); location.href='login.html'; });

    render();
  }

  // ---------- PANEL ADMIN ----------
  if(path === 'panel-admin.html'){
    const tablaP = qs('#tablaProductos');
    const tablaOP = qs('#tablaAdminPedidos');
    const nombreIn = qs('#prodNombre');
    const precioIn = qs('#prodPrecio');
    const agregarBtn = qs('#agregarProdBtn');
    const logoutBtn = qs('#logoutBtnAdmin');
    let editId = null;

    function renderProducts(){
      const products = JSON.parse(localStorage.getItem('products')||'[]');
      tablaP.innerHTML = '';
      products.forEach(p=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.name}</td><td>${p.price}</td><td><button class="btn small edit" data-id="${p.id}">Editar</button> <button class="btn ghost small del" data-id="${p.id}">Eliminar</button></td>`;
        tablaP.appendChild(tr);
      });
      qsa('.edit').forEach(b=>b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        const products = JSON.parse(localStorage.getItem('products')||'[]');
        const p = products.find(x=>x.id===id);
        if(p){ nombreIn.value = p.name; precioIn.value = p.price; editId = id; }
      }));
      qsa('.del').forEach(b=>b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        let products = JSON.parse(localStorage.getItem('products')||'[]');
        products = products.filter(x=>x.id!==id);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
      }));
    }

    agregarBtn && agregarBtn.addEventListener('click', ()=>{
      const name = nombreIn.value.trim();
      const price = Number(precioIn.value);
      if(!name || !price) return alert('Nombre y precio requeridos');
      let products = JSON.parse(localStorage.getItem('products')||'[]');
      if(editId){
        const p = products.find(x=>x.id===editId);
        p.name = name; p.price = price;
        editId = null;
      }else{
        products.push({id: uid(), name, price});
      }
      localStorage.setItem('products', JSON.stringify(products));
      nombreIn.value=''; precioIn.value='';
      renderProducts();
    });

    function renderOrders(){
      const orders = JSON.parse(localStorage.getItem('orders')||'[]').slice().reverse();
      tablaOP.innerHTML = '';
      orders.forEach(o=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${o.id}</td><td>${o.cliente}</td><td>${o.items.map(i=>i.name).join(', ')}</td><td>${o.total}</td><td>${o.status}</td><td>
          <select class="changeState" data-id="${o.id}">
            <option ${o.status==='new'?'selected':''}>new</option>
            <option ${o.status==='preparing'?'selected':''}>preparing</option>
            <option ${o.status==='ready'?'selected':''}>ready</option>
            <option ${o.status==='delivered'?'selected':''}>delivered</option>
          </select>
          </td>`;
        tablaOP.appendChild(tr);
      });
      qsa('.changeState').forEach(s=>s.addEventListener('change', e=>{
        const id = e.target.dataset.id;
        const orders = JSON.parse(localStorage.getItem('orders')||'[]');
        const o = orders.find(x=>x.id===id);
        if(o){
          o.status = e.target.value;
          if(o.status==='delivered'){
            const sales = JSON.parse(localStorage.getItem('sales')||'[]');
            sales.push({id:o.id,total:o.total,cliente:o.cliente, date:new Date().toISOString()});
            localStorage.setItem('sales', JSON.stringify(sales));
          }
          localStorage.setItem('orders', JSON.stringify(orders));
          renderOrders();
        }
      }));
    }

    logoutBtn && logoutBtn.addEventListener('click', ()=>{ sessionStorage.removeItem('user'); location.href='login.html'; });

    renderProducts();
    renderOrders();
  }

  // ---------- DASHBOARD ----------
  if(path === 'dashboard.html'){
    function render(){
      const sales = JSON.parse(localStorage.getItem('sales')||'[]');
      const orders = JSON.parse(localStorage.getItem('orders')||'[]');
      const totalVentas = sales.reduce((s,x)=>s+Number(x.total),0);
      qs('#totalVentas').textContent = totalVentas + ' COP';
      qs('#countPedidos').textContent = orders.length;
      qs('#pendientes').textContent = orders.filter(o=>o.status!=='delivered').length;
      const ventasList = qs('#ventasList');
      ventasList.innerHTML = '';
      sales.slice().reverse().forEach(sale=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${sale.id}</td><td>${sale.cliente}</td><td>${sale.total}</td><td>${new Date(sale.date).toLocaleString()}</td>`;
        ventasList.appendChild(tr);
      });
    }
    render();
  }

  // If other pages, nothing
})();
function exportToCSV(rows){
  const sep=",";
  const csv=rows.map(r=>Object.values(r).join(sep)).join("\n");
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="ventas.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
document.addEventListener("DOMContentLoaded",()=>{
  const btn=document.getElementById("exportCSV");
  if(btn){
    btn.onclick=()=>{
      const sales=JSON.parse(localStorage.getItem("sales")||"[]");
      exportToCSV(sales);
    }
  }
});
