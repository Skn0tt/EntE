Paper.pdf: Paper.md Paper.bib DB.pdf eisvogel.latex
	pandoc Paper.md -o Paper.pdf \
		--template eisvogel \
		--listings \
		--filter pandoc-citeproc
	
DB.pdf: DB.gv
	neato -T pdf DB.gv > DB.pdf
