Paper.pdf: Paper.md Paper.bib
	pandoc Paper.md -o Paper.pdf \
		--filter mermaid-filter \
		--template eisvogel \
		--listings \
		--filter pandoc-citeproc