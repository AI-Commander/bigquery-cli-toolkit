# Contributing to BigQuery CLI Toolkit

Thank you for your interest in contributing to the BigQuery CLI Toolkit! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/bigquery-cli-toolkit.git
   cd bigquery-cli-toolkit
   ```
3. **Set up the development environment** (see Prerequisites in README.md)
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Guidelines

### Code Style
- Use consistent JavaScript ES6+ features
- Follow existing code formatting and conventions
- Use descriptive variable and function names
- Add comments for complex logic

### SQL Queries
- Use lowercase for SQL keywords
- Format queries for readability
- Add comments explaining complex queries
- Test queries with small datasets first

### File Organization
- Place SQL queries in the appropriate `queries/` subdirectory
- Use descriptive filenames with dates when applicable
- Keep utility scripts in the `scripts/` directory
- Update documentation when adding new features

## 📝 Types of Contributions

### 🐛 Bug Reports
When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Error messages or logs

### 💡 Feature Requests
For new features, please provide:
- Clear description of the proposed feature
- Use case and benefits
- Possible implementation approach
- Backward compatibility considerations

### 🔧 Code Contributions

#### SQL Queries
- **New Analytics Queries**: Add queries for new insights or metrics
- **Query Optimization**: Improve performance of existing queries
- **View Definitions**: Create reusable views for common analysis patterns

#### JavaScript Tools
- **New CLI Tools**: Additional utilities for BigQuery interaction
- **Performance Improvements**: Optimize existing scripts
- **Error Handling**: Better error messages and recovery

#### Documentation
- **Usage Examples**: Add practical examples and use cases
- **Installation Guides**: Platform-specific setup instructions
- **API Documentation**: Document new features and functions

## 🧪 Testing

### Manual Testing
1. **Test your changes** with real BigQuery data
2. **Verify cost protection** works as expected
3. **Check output formats** are correct
4. **Test error handling** with invalid inputs

### Query Testing
1. **Dry-run all SQL queries** before submitting
2. **Test with different data sizes** to ensure scalability
3. **Verify result accuracy** with known datasets
4. **Check performance** with large datasets

## 📦 Pull Request Process

1. **Update documentation** for any new features
2. **Add or update tests** as appropriate
3. **Ensure your code follows** existing conventions
4. **Update the README.md** if adding new functionality
5. **Submit your pull request** with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots for UI changes
   - Testing notes

### Pull Request Checklist
- [ ] Code follows project conventions
- [ ] Documentation updated
- [ ] Tests pass (if applicable)
- [ ] No merge conflicts
- [ ] Clear commit messages
- [ ] Feature works as described

## 🔍 Code Review Process

1. **Maintainers review** all pull requests
2. **Feedback provided** within a few days
3. **Changes requested** may need addressing
4. **Approval and merge** once criteria met

## 🌟 Recognition

Contributors will be:
- Listed in the project README.md
- Mentioned in release notes
- Given credit in documentation

## 📬 Communication

- **GitHub Issues**: For bug reports and feature requests
- **Pull Request Comments**: For code-specific discussions
- **Project Discussions**: For general questions and ideas

## 🏷️ Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## 📋 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation updates
- `good first issue`: Good for newcomers
- `help wanted`: Community help needed
- `query`: SQL query related
- `performance`: Performance improvements
- `security`: Security related issues

## 🤝 Community Guidelines

- **Be respectful** and inclusive
- **Help others** learn and contribute
- **Provide constructive feedback**
- **Follow the code of conduct**

## 🔧 Development Tools

### Recommended Tools
- **VS Code** with SQL extensions
- **BigQuery Console** for query testing
- **Google Cloud SDK** for CLI operations
- **Node.js debugger** for JavaScript development

### Useful Extensions
- SQL syntax highlighting
- BigQuery syntax support
- JavaScript/Node.js debugging tools
- Markdown preview

## 📚 Resources

- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [Google Cloud SDK Docs](https://cloud.google.com/sdk/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

Thank you for contributing to BigQuery CLI Toolkit! Your contributions help make BigQuery analytics more accessible and powerful for everyone.
