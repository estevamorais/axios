const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
// axios.defaults.headers.common['Authorization'] = 'TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Adiciona um interceptador nas REQUISIÇÕES
// Muitas vezes usado para injetar o JWT em requisições
axios.interceptors.request.use((config) => {
	config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
	console.log(config)
	return config;
}, (error) => {
	// Faz alguma coisa com o erro da requisição
	return Promise.reject(error)
})

// Adiciona um interceptador nas REQUISIÇÕES
axios.interceptors.response.use(function (response) {
	// Qualquer código de status que dentro do limite de 2xx faz com que está função seja acionada
	// Faz alguma coisa com os dados de resposta
	console.log('Request success!')
	return response;
}, function (error) {
	// Qualquer código de status que não esteja no limite do código 2xx faz com que está função seja acionada
	// Faz alguma coisa com o erro da resposta
	console.log('Request error!')
	return Promise.reject(error);
});

const get = () => {
	const config = {
		params: {
			_limit: 2
		}
	}

	// Envia uma requisição get (200)
	// O GET retornda todos os dados do endpoint
	axios.get('https://jsonplaceholder.typicode.com/users', config)
		.then((response) => renderOutput(response));
}

const post = () => {
	const data = {
		title: 'foo',
		body: 'bar',
		userId: 1,
	}

	// Envia uma requisição post (201)
	// O POST cria uma novo dado
	axios.post('posts', data)
		.then((response) => renderOutput(response))
}

const put = () => {
	const data = {
		title: 'fooNewValue',
		body: 'barNewValue',
		userId: 1,
	}

	// Envia uma requisição put (200)
	// O PUT é indicado para atualizações de TODOS OS CAMPOS do payload (replace)
	axios.put('posts/1', data)
		.then((response) => renderOutput(response))
}

const patch = () => {
	const data = {
		body: 'barNewValue',
	}

	// Envia uma requisição patch (200)
	// O PATCH é indicado para atualização de APENAS UM CAMPO do payload
	axios.patch('posts/1', data)
		.then((response) => renderOutput(response))
}

const del = () => {
	// Envia uma requisição delete (200)
	// O DELETE é usado para deletar dados
	axios.delete('posts/2')
		.then((response) => renderOutput(response))
}

const multiple = () => {
	Promise.all([
		axios.get('posts?_limit=5'),
		axios.get('users?_limit=5')
	]).then((response) => {
		console.table(response[0].data)
		console.table(response[1].data)
	})
}

const transform = () => {
	const config = {
		params: {
			_limit: 10
		},
		// Transforma dados da response
		transformResponse: [function (data) {
			const payload = JSON.parse(data).map(item => {
				return {
					...item,
					author: 'Jon Snow',
					isSelected: false
				}
			})

			return payload
		}]
	}

	// Envia uma requisição get (200)
	// O GET retornda todos os dados do endpoint
	axios.get('posts', config)
		.then((response) => renderOutput(response));
}

const errorHandling = () => {
	// Forçando error (404)
	axios.get('forceerror')
		.then((response) => renderOutput(response))
		.catch((error) => {
			renderOutput(error)

			if (error.response) {
				// A requisição foi feita e o servidor respondeu com um código de status
				// que sai do alcance de 2xx
				console.error(error.response.data);
				console.error(error.response.status);
				console.error(error.response.headers);
			} else if (error.request) {
				// A requisição foi feita mas nenhuma resposta foi recebida
				// `error.request` é uma instância do XMLHttpRequest no navegador e uma instância de
				// http.ClientRequest no node.js
				console.error(error.request);
			} else {
				// Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
				console.error('Error', error.message);
			}
			console.error(error.config);
		});
}

const cancel = () => {
	const controller = new AbortController();

	const config = {
		params: {
			_limit: 2
		},
		signal: controller.signal
	}

	// Envia uma requisição get (200)
	// O GET retornda todos os dados do endpoint
	axios.get('posts', config)
		.then((response) => renderOutput(response))
		.catch((error) => console.error(error));

	// Ativar abort em contextos (exemplo botão, tracar de url no react, após determinado período)
	controller.abort()
}

const clear = () => {
	statusEl.innerHTML = '';
	statusEl.className = '';
	dataEl.innerHTML = '';
	headersEl.innerHTML = '';
	configEl.innerHTML = '';
}

const renderOutput = (response) => {
	// Status
	const status = response.status;
	statusEl.removeAttribute('class');
	let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
	if (status >= 500) {
		statusElClass += ' bg-red-100 text-red-800';
	} else if (status >= 400) {
		statusElClass += ' bg-yellow-100 text-yellow-800';
	} else if (status >= 200) {
		statusElClass += ' bg-green-100 text-green-800';
	}

	statusEl.innerHTML = status;
	statusEl.className = statusElClass;

	// Data
	dataEl.innerHTML = JSON.stringify(response.data, null, 2);
	Prism.highlightElement(dataEl);

	// Headers
	headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
	Prism.highlightElement(headersEl);

	// Config
	configEl.innerHTML = JSON.stringify(response.config, null, 2);
	Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
