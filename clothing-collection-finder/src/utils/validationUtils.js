// src/utils/validationUtils.js

export const validationUtils = {
    // 아이디 검증 (6~12자리 영문소문자, 숫자)
    validateUserId(userId) {
        const regex = /^[a-z0-9]{6,12}$/
        if (!userId) {
            return { isValid: false, message: '아이디를 입력해주세요.' }
        }
        if (!regex.test(userId)) {
            return { isValid: false, message: '6~12자리 영문 소문자, 숫자만 사용 가능합니다.' }
        }
        return { isValid: true, message: '' }
    },

    // 비밀번호 검증 (8~20자, 영문 대/소문자, 숫자, 특수문자 포함)
    validatePassword(password) {
        if (!password) {
            return { isValid: false, message: '비밀번호를 입력해주세요.' }
        }

        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /\d/.test(password)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
        const isValidLength = password.length >= 8 && password.length <= 20

        if (!isValidLength) {
            return { isValid: false, message: '비밀번호는 8~20자여야 합니다.' }
        }
        if (!hasUpperCase) {
            return { isValid: false, message: '영문 대문자를 포함해주세요.' }
        }
        if (!hasLowerCase) {
            return { isValid: false, message: '영문 소문자를 포함해주세요.' }
        }
        if (!hasNumbers) {
            return { isValid: false, message: '숫자를 포함해주세요.' }
        }
        if (!hasSpecialChar) {
            return { isValid: false, message: '특수문자를 포함해주세요.' }
        }

        return { isValid: true, message: '' }
    },

    // 비밀번호 확인 검증
    validatePasswordConfirm(password, passwordConfirm) {
        if (!passwordConfirm) {
            return { isValid: false, message: '비밀번호 확인을 입력해주세요.' }
        }
        if (password !== passwordConfirm) {
            return { isValid: false, message: '비밀번호가 일치하지 않습니다.' }
        }
        return { isValid: true, message: '' }
    },

    // 닉네임 검증 (2~10자)
    validateNickname(nickname) {
        if (!nickname) {
            return { isValid: false, message: '닉네임을 입력해주세요.' }
        }
        if (nickname.length < 2 || nickname.length > 10) {
            return { isValid: false, message: '닉네임은 2~10자여야 합니다.' }
        }
        return { isValid: true, message: '' }
    },

    // 이메일 검증
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            return { isValid: false, message: '이메일을 입력해주세요.' }
        }
        if (!regex.test(email)) {
            return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' }
        }
        return { isValid: true, message: '' }
    },

    // 전체 회원가입 폼 검증
    validateSignupForm(formData) {
        const validations = [
            this.validateUserId(formData.userId),
            this.validatePassword(formData.password),
            this.validatePasswordConfirm(formData.password, formData.passwordConfirm),
            this.validateNickname(formData.nickname),
            this.validateEmail(formData.email)
        ]

        // 약관 동의 검증
        if (!formData.agreeTerms || !formData.agreePrivacy || !formData.agreeLocation || !formData.agreeAge) {
            validations.push({ isValid: false, message: '모든 필수 약관에 동의해주세요.' })
        }

        const errors = validations.filter(v => !v.isValid)
        return {
            isValid: errors.length === 0,
            errors: errors.map(e => e.message)
        }
    }
}