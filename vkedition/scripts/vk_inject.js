(function (){	// Обернем все в безымянную функцию, чтобы не создавать глобальных переменных
	// Этот observer будет следить за добавлением аудиозаписей в найденные списки аудиозаписей
	var trackObserver = new MutationObserver(listModified);

	// Первоначально, проверим, не существуют ли уже списки аудиозаписей на странице
	var list_ids = ['pad_playlist', 'pad_search_list', 'initial_list', 'search_list', 'choose_audio_rows'];
	for (var i= 0 ; i < list_ids.length; i++)
	{
		var list = document.getElementById(list_ids[i]);
		if (list)
		{
			// добавим ссылки "Скачать" ко всем записям, и будем следить за изменениями с помощью trackObserver
			listFound(list);
		}
	}
	// отдельно ищем результат поиска аудиозаписей, потому что там нужно проверить css класс
	list = document.getElementById('results');
	if (list && list.classList.contains('audio_results'))
	{
		listFound(list);
	}

	// Создадим observer для нотификаций о создании новых элементов на странице
	var listObserver = new MutationObserver(elementAdded);
	// и следим за body, когда новые списки аудиозаписей добавятся
	listObserver.observe(document.body, {childList: true, subtree: true});

	// вызывается при любой модификации DOM страницы
	function elementAdded(mutations)
	{
		for (var i = 0; i < mutations.length; i++)
		{
			var added = mutations[i].addedNodes;
			// просмотрим добавленные элементы на предмет списка аудиозаписей
			for (var j = 0; j < added.length; j++)
			{
				findAudioLists(added[j]);
			}
		}
	}

	// рекурсивная функция проходит по добавленным элементам и ищет в них списки аудиозаписей
	function findAudioLists(node)
	{
		if (node.id)	// у списка должно быть id
		{
			for (var i = 0; i < list_ids.length; i++)	// смотрим, совпадает ли id с искомыми
			{
				if (list_ids[i] == node.id)
				{
					listFound(node);
					return;	// не будем искать внутри уже найденного списка
				}
			}
			if (node.id == 'results')	// отдельно будем искать '#results.audio_results' - результаты поиска
			{
				if (node.classList.contains('audio_results'))
				{
					listFound(node);
					return;
				}
			}
		}
		// пройдемся по дереву добавленного элемента
		var child = node.firstElementChild;
		while (child)
		{
			findAudioLists(child);	// вызываем рекурсивно для всех дочерних элементов
			child = child.nextElementSibling;
		}
	}

	// найден один из списков, в котором содержатся аудиозаписи
	function listFound(listNode)
	{
		if (listNode.children.length)	// в новом списке уже есть аудиозаписи
		{
			for (var j = 0; j < listNode.children.length; j++)
			{
				addDownloadLink(listNode.children[j]);	// добавим в каждую по ссылке "Скачать"
			}
		}
		trackObserver.observe(listNode, {childList: true});	// следим за добавлением новых записей -> listModified()
	}

	// вызывается, когда в список песен добавляются (или удаляются) элементы
	function listModified(mutations)
	{
		for (var i = 0; i < mutations.length; i++)
		{
			var mut = mutations[i];
			// пройдем по добавленным песням
			for (var j = 0; j < mut.addedNodes.length; j++)
			{
				addDownloadLink(mut.addedNodes[j]);
			}
			// удаленныые записи - mut.removedNodes игнорируем
		}
	}

	// Добавляет ссылку "Скачать" к разметке песни
	function addDownloadLink(row)
	{
		// новый элемент-аудиозапись может иметь различную разметку, в зависимости от того, куда добавляется
		if (!row.classList.contains('audio'))
		{
			// возможно, это элемент из списка "Прикрепить аудиозапись"
			row = row.querySelector('div.audio');	// внутри него содержится 'div.audio', с которым мы будем работать
			if (!row)
			{
				return;
			}
		}
		var titleNode = row.querySelector('div.title_wrap');	// Исполнитель песни + название
		if (!titleNode)	// если ничего не находим - выйдем (может, разметка была изменена?)
		{
			return;
		}
		// может, наша ссылка уже есть? Так бывает, если вконтакте перемещает список из одного элемента в другой
		if (titleNode.querySelector('a.downloadLink'))
		{
			return;	// ссылка уже была добавлена ранее
		}
		var input = row.querySelector('div.play_btn > input');	// найдем input, в котором хранится url
		if (!input)
		{
			input = row.querySelector('div.play_btn_wrap + input');	// проверим другой способ разметки
			if (!input)
			{
				return;	// не та разметка
			}
		}
		var ref = input.getAttribute('value');	// сам URL
		ref = ref.substr(0, ref.indexOf('?'));	// обрежем все после '?', чтобы оставить только ссылку на mp3

		var link = document.createElement('a');
		link.className = 'downloadLink';	// Добавим класс 'downloadLink' для нашей ссылки
		link.textContent = "↓";
		link.setAttribute('title', "Скачать");
		link.setAttribute('download', titleNode.textContent + '.mp3');	// Имя файла для загрузки
		link.setAttribute('href', ref);
		link.addEventListener('click', function(event){	// при клике на нашу ссылку, отменим запуск проигрывателя
			event.stopPropagation();
		});
		titleNode.appendChild(link);
	}
})();